import express from 'express'
import isAuth from '../middlewares/isAuth.js';

import { upload } from '../middlewares/multer.js';
import { checkIfStory, getAllStories, getStoryByUserName, uploadStory, viewStory } from '../controllers/story.controller.js';




const router = express.Router();

router.post('/upload' , isAuth , upload.single("media") , uploadStory);
router.get('/getByUserName/:userName' , isAuth , getStoryByUserName);
router.put('/view/:storyId' , isAuth , viewStory);
router.get('/get-all-stories', isAuth , getAllStories);
router.get('/check-story' , isAuth , checkIfStory);



export default router;
