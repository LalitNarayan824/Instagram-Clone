import express from 'express'
import isAuth from '../middlewares/isAuth.js';

import { upload } from '../middlewares/multer.js';
import { getAllMessages, getPreviousUserChats, sendMessage } from '../controllers/message.controller.js';




const router = express.Router();


router.post('/send/:receiverId' , isAuth , upload.single("image"), sendMessage);
router.get('/getAll/:receiverId' , isAuth , getAllMessages);
router.get('/prevChats' , isAuth , getPreviousUserChats);




export default router;
