import express from 'express'
import isAuth from '../middlewares/isAuth.js';
import { editProfile, getAllNotfications, getCurrentUser, getProfile, getSuggestedUsers, getUserPosts, getUserSavedPosts, markAsRead, search, toggleFollowUser } from '../controllers/user.controller.js';
import { upload } from '../middlewares/multer.js';


const router = express.Router();

router.get('/current' , isAuth , getCurrentUser);
router.get('/suggested' , isAuth , getSuggestedUsers);
router.post('/editProfile' , isAuth , upload.single("profileImage") , editProfile );

router.get('/getProfile/:userName' , isAuth , getProfile);
router.get('/get-user-posts/:userId' , isAuth , getUserPosts);
router.get('/get-user-saved-posts/:userId' , isAuth , getUserSavedPosts);
router.put('/follow/:userId' , isAuth , toggleFollowUser)
router.get('/search', isAuth , search)
router.get('/getAllNotifications', isAuth , getAllNotfications);
router.get('/markAsRead/:notificationId' , isAuth , markAsRead);


export default router;
