// utils
import bcrypt from "bcryptjs";
import genToken from "../utils/token.js";
// models
import User from "../models/user.model.js";
import sendOtpMail from "../utils/Mail.js";

// # AUTH LOGIC STARTS

//  sign up logic
export const signUp = async (req, res) => {
  try {
    const { name, email, password, userName } = req.body;
    //  we are assuming all the fields data is present in the req body

    // username and email should be unique for every user # checks for that
    const findByEmail = await User.findOne({ email });

    if (findByEmail) {
      return res.status(400).json({ message: "Email already in use !" });
    }

    const findByUsername = await User.findOne({ userName });

    if (findByUsername) {
      return res.status(400).json({ message: "Username already in use !" });
    }

    // both the checks are complete

    // password must be atleast 6 chars long
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be 6 characters long !" });
    }

    // hashing password
    const salt = await bcrypt.genSalt(10);
    console.log(salt);

    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(hashedPassword);

    // creating the user with the hashed password
    const user = await User.create({
      name,
      userName,
      email,
      password: hashedPassword,
    });

    // creating the token with load as user id
    const token = await genToken(user._id);

    // putting the token in the cookie of the user
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 365 * 24 * 60 * 60 * 1000,
      secure: false, // for dev its false , in prod it should be true
      sameSite: "Strict", // for dev its strict
    });

    return res.status(201).json(user);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: `error in signup controller : ${error}` });
  }
};
// sign in logic
export const signIn = async (req, res) => {
  try {
    const { password, userName } = req.body;
    //  we are assuming all the fields data is present in the req body

    //  user is searched on username
    const user = await User.findOne({ userName });
    // check if exists
    if (!user) {
      return res.status(400).json({ message: "User not found!" });
    }
    // comparing password
    const isMatch = await bcrypt.compare(password, user.password);
    // check
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials !" });
    }

    // creating the token with load as user id
    const token = await genToken(user._id);

    // putting the token in the cookie of the user
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 365 * 24 * 60 * 60 * 1000,
      secure: false, // for dev its false , in prod it should be true
      sameSite: "Strict", // for dev its strict
    });

    return res.status(200).json(user);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `error in sign in controller : ${error}` });
  }
};
// sign out logic
export const signOut = async (req, res) => {
  try {
    res.clearCookie("token");

    return res.status(200).json({ message: "logged out successfully !" });
  } catch (error) {
    return res.status(500).json({ message: `error in sign out : ${error}` });
  }
};

// # AUTH LOGIC ENDS

// # RESET OTP LOGIC STARTS

// sends otp to user once they input their email
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    user.resetOtp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000;
    user.isOtpVerified = false;
    await user.save();

    await sendOtpMail(email, otp);
    return res.status(200).json({ message: "Otp sent successfully" });
  } catch (error) {
    console.log("Error in send otp controller :" + error);
    return res.status(500).json({ message: "error in send otp : " + error });
  }
};
// to verify the otp sent by the user
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    console.log("User:", user);
    console.log("Provided OTP:", otp);
    console.log("Stored OTP:", user?.resetOtp, "Expires at:", user?.otpExpires);

    if (
      !user ||
      !otp ||
      user?.resetOtp !== otp ||
      user?.otpExpires < Date.now()
    ) {
      return res
        .status(400)
        .json({ message: "invalid credentials or Otp expired" });
    }

    user.isOtpVerified = true;
    user.resetOtp = undefined;
    user.otpExpires = undefined;
    await user.save();

    return res.status(200).json({ message: "Otp verified successfully" });
  } catch (error) {
    console.log("Error in verify otp controller :" + error);
    return res.status(500).json({ message: "error in verify otp : " + error });
  }
};
// to reset password once the otp is verified
export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;

    const user = await User.findOne({ email });

    if (!user || !user.isOtpVerified) {
      return res
        .status(400)
        .json({ message: "user not found or otp not verified" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Both password must match" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.isOtpVerified = false;
    await user.save();

    return res.status(200).json({ message: "Password reset successfull. Go back to login" });
  } catch (error) {
    console.log("Error in reset password controller :" + error);
    return res
      .status(500)
      .json({ message: "error in reset password : " + error });
  }
};

// # RESET OTP LOGIC ENDS
