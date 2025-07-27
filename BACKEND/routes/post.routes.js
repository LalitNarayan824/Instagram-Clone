import express from 'express'
import isAuth from '../middlewares/isAuth.js';

import { upload } from '../middlewares/multer.js';
import { commentPost, getAllPosts, getFeedPosts, getPostComments, likePost, savePost, uploadPost } from '../controllers/post.controller.js';



const router = express.Router();

router.post('/upload' , isAuth , upload.single("media") , uploadPost )
router.get('/all' , isAuth , getAllPosts )
router.get('/feed' , isAuth , getFeedPosts );
router.post('/like/:postId' , isAuth , likePost);
router.post('/comment/:postId' , isAuth , commentPost);
router.post('/save/:postId' , isAuth , savePost);
router.get('/get-comments/:postId', isAuth , getPostComments);





export default router;
