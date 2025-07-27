import Story from "../models/story.model.js";
import User from "../models/user.model.js"
import uploadOnCloudinary from "../utils/cloudinary.js";



// * user can upload only one story at once and is a previous story is there it will get deleted
export const uploadStory = async (req, res)=>{
  try {
    const user = await User.findById(req.userId);

    // ! user.story = story's Id
    if(user.story){
      await Story.findByIdAndDelete(user.story)
    }

    const {mediaType } = req.body

    let media;
    if(req.file){
      media = await uploadOnCloudinary(req.file.path)
    }
    else{
      return res.status(400).json({message : " media is required !"})
    }

    const story = await Story.create({
      author:req.userId, mediaType , media
    })

    user.story = story._id;
    await user.save();

    const populatedStory = await Story.findById(story._id).populate("author" , "name userName profileImage").populate("viewers" , "name userName profileImage");

    return res.status(201).json(populatedStory);


  } catch (error) {
    console.log(error)
    return res.status(500).json({message : "story upload error"})
  }
}


export const viewStory = async (req , res)=>{
  try {
    const storyId = req.params.storyId
    const story = await Story.findById(storyId);

    if(!story){
      return res.status(400).json({message : " story not found ! "})
    }

    const viewersIds = story.viewers.map(id => id.toString());

    if(!viewersIds.includes(req.userId.toString())){
      story.viewers.push(req.userId);
      await story.save()
    }

    const populatedStory = await Story.findById(story._id).populate("author" , "name userName profileImage").populate("viewers" , "name userName profileImage");

    return res.status(200).json(populatedStory);



  } catch (error) {
    console.log(error)
    return res.status(500).json({message : "story view error"})
  }
}

// ^ when a user will click on one of the stories in the stories sections they will be redirected to the story page and story of the person will be displayed there , which we can access via the userName of the person


export const getStoryByUserName = async (req, res) => {
  try {
    const { userName } = req.params;

    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const story = await Story.findOne({ author: user._id })
      .populate("viewers", "name userName profileImage")
      .populate("author", "name userName profileImage");

    if (!story) {
      return res.status(404).json({ message: "Story not found for this user" });
    }

    return res.status(200).json(story);
  } catch (error) {
    console.error("Error fetching story:", error);
    return res.status(500).json({ message: "Error fetching story by username" });
  }
};


export const getAllStories = async (req, res) => {
  try {
    const currentUser = await User.findById(req.userId);

    const followingIds = currentUser.following;

    const stories = await Story.find({ author: { $in: followingIds } })
      .populate("author", "userName profileImage")
      .populate("viewers", "userName profileImage")
      .sort({ createdAt: -1 });

    return res.status(200).json(stories);
  } catch (error) {
    console.error("Error fetching all story:", error);
    return res.status(500).json({ message: "Error fetching all story" });
  }
};


export const checkIfStory = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.story) {
      // User has no story ID assigned
      return res.status(200).json({ message: "No story assigned" });
    }

    const story = await Story.findById(user.story);

    if (!story) {
      // Story doesn't exist, reset user.story
      user.story = null;
      await user.save();
      return res.status(200).json({ message: "Story expired and removed from user" });
    }

    // Story exists
    return res.status(200).json({ message: "Story exists and is valid" });

  } catch (error) {
    console.error("Error in checkIfStory:", error);
    return res.status(500).json({ message: "Server error in checkIfStory" });
  }
};
