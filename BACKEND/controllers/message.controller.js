
import Conversation from '../models/conversation.model.js';
import Message from '../models/messages.model.js';
import { getSocketId, io } from '../socket.js';
import uploadOnCloudinary from '../utils/cloudinary.js';



export const sendMessage = async (req, res) => {
  try {
    const senderId = req.userId;
    const receiverId = req.params.receiverId;
    const { message } = req.body;

    if (!receiverId || receiverId === senderId) {
      return res.status(400).json({ message: "Invalid receiver" });
    }

    let image;
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
      
    }

    const newMessage = await Message.create({
      sender: senderId,
      receiver: receiverId,
      message,
      image,
    });

    const participantIds = [senderId.toString(), receiverId.toString()].sort((a, b) => a.localeCompare(b));

    let conversation = await Conversation.findOne({ participants: { $all: participantIds } });

    if (!conversation) {
      await Conversation.create({
        participants: participantIds,
        messages: [newMessage._id],
      });
    } else {
      await Conversation.updateOne(
        { _id: conversation._id },
        {
          $push: { messages: newMessage._id },
          $set: { updatedAt: new Date() },
        }
      );
    }

    const receiverSocketId = getSocketId(receiverId)
    if(receiverSocketId){

      io.to(receiverSocketId).emit('newMessage' , newMessage);
    }

    return res.status(200).json(newMessage);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error in sending message" });
  }
};




export const getAllMessages = async (req, res) => {
  try {
    const senderId = req.userId;
    const receiverId = req.params.receiverId;

    console.log("senderId:", req.userId);
console.log("receiverId:", req.params.receiverId);


    const participants = [senderId.toString(), receiverId.toString()].sort();

    const conversation = await Conversation.findOne({
      participants: { $all: participants }
    }).populate({
      path: "messages",
      populate: {
        path: "sender",
        select: "userName profileImage",
      },
    });

    if (!conversation) {
      return res.status(200).json([]); // no messages yet
    }

    return res.status(200).json(conversation.messages);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error in getting messages" });
  }
};



export const getPreviousUserChats = async (req, res) => {
  try {
    const currentUserId = req.userId;

    const conversations = await Conversation.find({
      participants: currentUserId
    })
      .populate("participants", "userName profileImage ")
      .populate({
        path: "messages",
        options: { sort: { createdAt: -1 }, limit: 1 }, // get last message only
      })
      .sort({ updatedAt: -1 });

    const chatList = [];

    conversations.forEach(conv => {
      const otherUser = conv.participants.find(
        user => user._id.toString() !== currentUserId.toString()
      );

      if (otherUser) {
        chatList.push({
          user: otherUser,
          lastMessage: conv.messages[0] || null,
          updatedAt: conv.updatedAt,
        });
      }
    });

    return res.status(200).json(chatList);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "error in getting previous users with last message" });
  }
};
