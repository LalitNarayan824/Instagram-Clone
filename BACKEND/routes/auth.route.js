import express from 'express'
import { resetPassword, sendOtp, signIn, signOut, signUp, verifyOtp } from '../controllers/auth.controller.js';

const router = express.Router();

// user auth routes
router.post('/signup' , signUp)
router.post('/signin' , signIn)
router.post('/signout' , signOut)

// forgot password routes
router.post('/send-otp' , sendOtp);
router.post('/verify-otp' , verifyOtp)
router.post('/reset-password' , resetPassword);


export default router;