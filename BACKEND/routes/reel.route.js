import express from 'express'
import isAuth from '../middlewares/isAuth.js';

import { upload } from '../middlewares/multer.js';
import {  commentReel, getAllReels, getReelComments, likeReel, uploadReel } from '../controllers/reel.controller.js';




const router = express.Router();

router.post('/upload' , isAuth , upload.single("media") , uploadReel )
router.get('/getAll' , isAuth , getAllReels )
router.post('/like/:reelId' , isAuth , likeReel);
router.post('/comment/:reelId' , isAuth , commentReel);
router.get('/get-comments/:reelId' , isAuth , getReelComments);





export default router;
