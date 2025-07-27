import uploadOnCloudinary from "../utils/cloudinary.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { getSocketId, io } from "../socket.js";
import Notification from "../models/notification.model.js";

export const uploadPost = async (req, res) => {
  try {
    const { caption, mediaType } = req.body;

    let media;
    if (req.file) {
      media = await uploadOnCloudinary(req.file.path);
    } else {
      return res.status(400).json({ message: "media is required!" });
    }

    const post = await Post.create({
      caption,
      media,
      mediaType,
      author: req.userId,
    });

    const user = await User.findById(req.userId);

    user.posts.push(post._id);
    await user.save();

    const populatedPost = await Post.findById(post._id).populate(
      "author",
      "name userName profileImage"
    );

    return res.status(201).json(populatedPost);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "upload Post error : " + error });
  }
};

// export const getAllPosts = async (req, res) => {
//   try {
//     const posts = await Post.find({}).populate(
//       "author",
//       "name userName profileImage"
//     );

//     return res.status(200).json(posts);
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: "get all Posts error : " + error });
//   }
// };

export const likePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    const alreadyLiked = post.likes.includes(req.userId);

    if (alreadyLiked) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== req.userId.toString()
      );
    } else {
      post.likes.push(req.userId);
      if(post.author._id != req.userId){
        const notification = await Notification.create({
          sender:req.userId,
          receiver:post.author._id,
          type:"like",
          post:post._id,
          message:"liked your post"
        })
        const populatedNotification = await Notification.findById(notification._id).populate("sender receiver post");

        const receiverSocketId = getSocketId(post.author._id);

        if(receiverSocketId){
          io.to(receiverSocketId).emit("newNotification", populatedNotification)
        }


      }

    }

    await post.save();
    await post.populate("author", "name userName profileImage");

    io.emit("likedPost", {
      postId:postId,
      likes:post.likes.length
    })

    return res.status(200).json(post);
  } catch (error) {
    console.error("Like post error:", error);
    return res.status(500).json({ message: "Like post error", error });
  }
};

export const commentPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { message } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({ message: "Comment message is required." });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    post.comments.push({
      author: req.userId,
      message,
    });

    if(post.author._id != req.userId){
        const notification = await Notification.create({
          sender:req.userId,
          receiver:post.author._id,
          type:"comment",
          post:post._id,
          message:"commented on your post"
        })
        const populatedNotification = await Notification.findById(notification._id).populate("sender receiver post");

        const receiverSocketId = getSocketId(post.author._id);

        if(receiverSocketId){
          io.to(receiverSocketId).emit("newNotification", populatedNotification)
        }


      }


    await post.save();

    // Repopulate updated post data
    await post.populate("author", "name userName profileImage");
    await post.populate("comments.author", "name userName profileImage");

    io.emit("commentPost", {
      postId:postId,
      comments:post.comments
    })

    return res.status(200).json(post);
  } catch (error) {
    console.error("Comment post error:", error);
    return res.status(500).json({ message: "Comment post error", error });
  }
};

export const savePost = async (req, res) => {
  try {
    const { postId } = req.params;

    if (!postId) {
      return res.status(400).json({ message: "Post ID is required." });
    }

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const index = user.saved.findIndex(
      (id) => id.toString() === postId.toString()
    );

    if (index > -1) {
      // Already saved, so remove it
      user.saved.splice(index, 1);
    } else {
      user.saved.push(postId);
    }

    await user.save();
    await user.populate("saved"); // NOTE: await is important here

    return res.status(200).json(user);
  } catch (error) {
    console.error("Save post error:", error);
    return res.status(500).json({ message: "Save post error", error });
  }
};

export const getFeedPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.cursor) || 0;
    const LIMIT = 4; // or whatever number per page you want
    const skip = page * LIMIT;

    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(LIMIT);

    const hasNextPage = posts.length === LIMIT;

    // Optional delay to simulate loading
    await new Promise((resolve) => setTimeout(resolve, 1000));

    res.status(200).json({
      posts,
      nextCursor: hasNextPage ? page + 1 : null,
    });
  } catch (error) {
    console.error("Error fetching feed posts:", error.message);
    res.status(500).json({ error: "Failed to load feed" });
  }
};



export const getAllPosts = async (req, res) => {
  try {
    const currentUserId = req.userId;

    const user = await User.findById(currentUserId).select("saved following");

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("author", "userName name profileImage");

    const result = posts.map((post) => {
      const isLiked = post.likes.includes(currentUserId);
      const isSaved = user.saved.includes(post._id);
      const isFollowed = user.following.includes(post.author._id);

      return {
        ...post.toObject(),
        isLiked,
        isSaved,
        isFollowed,
      };
    });

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


export const getPostComments = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId)
      .populate("comments.author", "userName profileImage");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.status(200).json(post.comments.reverse());
  } catch (error) {
    console.error("Error fetching comments:", error);
    return res.status(500).json({ message: "Error fetching comments", error });
  }
};



