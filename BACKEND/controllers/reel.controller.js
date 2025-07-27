import uploadOnCloudinary from "../utils/cloudinary.js";
import Reel from "../models/reel.model.js";
import User from "../models/user.model.js";
import { io } from "../socket.js";
import Notification from "../models/notification.model.js";

export const uploadReel = async (req, res) => {
  try {
    const { caption } = req.body;

    let media;
    if (req.file) {
      media = await uploadOnCloudinary(req.file.path);
    } else {
      return res.status(400).json({ message: "media is required!" });
    }

    const reel = await Reel.create({
      caption,
      media,
      author: req.userId,
    });

    const user = await User.findById(req.userId);

    user.reels.push(reel._id);
    await user.save();

    const populatedReel = await Reel.findById(reel._id).populate(
      "author",
      "name userName profileImage"
    );

    return res.status(201).json(populatedReel);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "upload Reel error : " + error });
  }
};

export const likeReel = async (req, res) => {
  try {
    const { reelId } = req.params;

    const reel = await Reel.findById(reelId);

    if (!reel) {
      return res.status(404).json({ message: "reel not found." });
    }

    const alreadyLiked = reel.likes.includes(req.userId);

    if (alreadyLiked) {
      reel.likes = reel.likes.filter(
        (id) => id.toString() !== req.userId.toString()
      );
    } else {
      reel.likes.push(req.userId);
      if(reel.author._id != req.userId){
              const notification = await Notification.create({
                sender:req.userId,
                receiver:reel.author._id,
                type:"like",
                reel:reel._id,
                message:"liked your reel"
              })
              const populatedNotification = await Notification.findById(notification._id).populate("sender receiver reel");
      
              const receiverSocketId = getSocketId(reel.author._id);
      
              if(receiverSocketId){
                io.to(receiverSocketId).emit("newNotification", populatedNotification)
              }
      
      
            }
    }

    await reel.save();
    await reel.populate("author", "name userName profileImage");

    io.emit("likedReel", {
      reelId: reelId,
      likes: reel.likes.length,
    });

    return res.status(200).json(reel);
  } catch (error) {
    console.error("Like reel error:", error);
    return res.status(500).json({ message: "Like reel error", error });
  }
};

export const commentReel = async (req, res) => {
  try {
    const { reelId } = req.params;
    const { message } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({ message: "Comment message is required." });
    }

    const reel = await Reel.findById(reelId);

    if (!reel) {
      return res.status(404).json({ message: "Reel not found." });
    }

    reel.comments.push({
      author: req.userId,
      message,
    });

    if(reel.author._id != req.userId){
            const notification = await Notification.create({
              sender:req.userId,
              receiver:reel.author._id,
              type:"comment",
              reel:reel._id,
              message:"commented on your reel"
            })
            const populatedNotification = await Notification.findById(notification._id).populate("sender receiver reel");
    
            const receiverSocketId = getSocketId(reel.author._id);
    
            if(receiverSocketId){
              io.to(receiverSocketId).emit("newNotification", populatedNotification)
            }
    
    
          }

    await reel.save();

    // Repopulate updated post data
    await reel.populate("author", "name userName profileImage");
    await reel.populate("comments.author", "name userName profileImage");

    io.emit("commentReel", {
      reelId: reelId,
      comments: reel.comments,
    });

    return res.status(200).json(reel);
  } catch (error) {
    console.error("Comment reel error:", error);
    return res.status(500).json({ message: "Comment reel error", error });
  }
};

export const getAllReels = async (req, res) => {
  try {
    const currentUserId = req.userId;

    const reels = await Reel.find({})
      .populate("author", "name userName profileImage")
      .populate("comments.author");

    // Add isLiked flag to each reel
    const updatedReels = reels.map((reel) => {
      const isLiked = reel.likes.includes(currentUserId);
      return {
        ...reel.toObject(), // convert to plain JS object so we can modify
        isLiked,
      };
    });

    return res.status(200).json(updatedReels);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "get all Reels error: " + error });
  }
};

export const getReelComments = async (req, res) => {
  try {
    const { reelId } = req.params;

    const reel = await Reel.findById(reelId).populate(
      "comments.author",
      "userName profileImage"
    );

    if (!reel) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.status(200).json(reel.comments.reverse());
  } catch (error) {
    console.error("Error fetching comments for reel :", error);
    return res
      .status(500)
      .json({ message: "Error fetching comments fo reel :", error });
  }
};
