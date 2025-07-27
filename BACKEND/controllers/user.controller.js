import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import { getSocketId, io } from "../socket.js";

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).populate("posts reels");

    if (!user) {
      return res.status(400).json({ message: "user not found !" });
    }

    const { password, ...otherDetails } = user._doc;

    return res.status(200).json(otherDetails);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: `error in get current user: ${error}` });
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const currentUser = await User.findById(req.userId);

    if (!currentUser) {
      return res.status(404).json({ message: "Current user not found" });
    }

    const result = await User.find({
      _id: {
        $nin: [...currentUser.following, req.userId], // exclude following + self
      },
    })
      .select("-password")
      .limit(5);

    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: `Error in getSuggestedUsers: ${error}` });
  }
};

export const editProfile = async (req, res) => {
  try {
    const { name, userName, bio, profession, gender } = req.body;

    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    //* Check if the new username already exists (excluding current user)
    const sameUserWithUsername = await User.findOne({ userName }).select(
      "-password"
    );
    if (
      sameUserWithUsername &&
      sameUserWithUsername._id.toString() !== req.userId
    ) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // *Handle profile image upload (if provided)
    let profileImage;
    if (req.file) {
      profileImage = await uploadOnCloudinary(req.file.path);
      if (profileImage) {
        user.profileImage = profileImage;
      }
    }

    // *Update only if value is provided
    if (name) user.name = name;
    if (userName) user.userName = userName;
    if (bio) user.bio = bio;
    if (profession) user.profession = profession;
    if (gender) user.gender = gender;

    await user.save();

    return res.status(200).json({ message: "Profile edited successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error in edit profile controller: " + error });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userName = req.params.userName;
    const currentUserId = req.userId;

    const user = await User.findOne({ userName }).select("-password");

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    let isFollow = false;

    // If not viewing own profile, check if current user follows them
    if (user._id.toString() !== currentUserId.toString()) {
      isFollow = user.followers.includes(currentUserId);
    }

    return res.status(200).json({
      ...user._doc,
      isFollow,
    });
  } catch (error) {
    console.error("Error in getProfile controller:", error);
    return res
      .status(500)
      .json({ message: "Error in getProfile controller: " + error });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).populate({
      path: "posts",
      select: "media caption", // add other fields as needed
      options: { sort: { createdAt: -1 } }, // sort recent posts first
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user.posts);
  } catch (error) {
    console.error("Error fetching user posts:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch user posts", error });
  }
};
export const getUserSavedPosts = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).populate({
      path: "saved",
      select: "media caption", // add other fields as needed
      options: { sort: { createdAt: -1 } }, // sort recent posts first
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user.saved);
  } catch (error) {
    console.error("Error fetching user saved posts:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch user saved posts", error });
  }
};

export const toggleFollowUser = async (req, res) => {
  try {
    const currentUserId = req.userId; // from middleware
    const targetUserId = req.params.userId; // user to follow/unfollow

    if (currentUserId === targetUserId) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({ message: "Target user not found" });
    }

    const isFollowing = currentUser.following.includes(targetUserId);

    if (isFollowing) {
      // UNFOLLOW
      currentUser.following.pull(targetUserId);
      targetUser.followers.pull(currentUserId);
    } else {
      // FOLLOW
      currentUser.following.push(targetUserId);
      targetUser.followers.push(currentUserId);
      if (currentUser._id != targetUser._id) {
        const notification = await Notification.create({
          sender: currentUser._id,
          receiver: targetUser._id,
          type: "follow",
          
          message: "started following you !",
        });
        const populatedNotification = await Notification.findById(
          notification._id
        ).populate("sender receiver");

        const receiverSocketId = getSocketId(targetUser._id);

        if (receiverSocketId) {
          io.to(receiverSocketId).emit(
            "newNotification",
            populatedNotification
          );
        }
      }
    }

    await currentUser.save();
    await targetUser.save();

    return res.status(200).json({
      message: isFollowing ? "Unfollowed user" : "Followed user",
      following: !isFollowing,
    });
  } catch (error) {
    console.error("Follow/unfollow error:", error);
    return res.status(500).json({ message: "Something went wrong", error });
  }
};

export const search = async (req, res) => {
  try {
    const keyWord = req.query.keyWord;

    if (!keyWord) {
      return res.status(400).json({ message: "keyword is required !" });
    }

    const users = await User.find({
      $or: [
        { userName: { $regex: keyWord, $options: "i" } },
        { name: { $regex: keyWord, $options: "i" } },
      ],
    }).select("-password");

    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: " error in getting searched users " });
  }
};



export const getAllNotfications = async (req , res)=>{
  try {
    const notifications = await Notification.find({
      receiver:req.userId
    }).populate("sender receiver post reel");

    return res.status(200).json(notifications)

  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: " error in getting notifications " });
  }
}

export const markAsRead = async(req, res)=>{
  try {
    const notificationId = req.params.notificationId
    
    const notification = await Notification.findById(notificationId).populate("sender receiver post reel");

    notification.isRead = true;
     await notification.save()

     return res.json(200).json({message : " notficaiton read"})
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: " error in reading notifications " });
  }
}