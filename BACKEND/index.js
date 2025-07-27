// ^ dependenices
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors"

// ^ uitls
import connectDb from "./utils/connectDb.js";


// ^ routers
import authRouter from './routes/auth.route.js'
import userRouter from './routes/user.route.js'
import postRouter from "./routes/post.routes.js";
import reelRouter from './routes/reel.route.js'
import storyRouter from "./routes/story.route.js";
import messageRouter from "./routes/message.route.js";
import { app, server } from "./socket.js";

dotenv.config();


const port = process.env.PORT || 5001;
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"))
app.use(cors({
  origin:"http://localhost:5173",
  credentials:true,
}))

// ^ routes setup
app.use('/api/auth' , authRouter);
app.use('/api/user' , userRouter);
app.use('/api/post' , postRouter);
app.use('/api/reel' , reelRouter);
app.use('/api/story' , storyRouter);
app.use('/api/message' , messageRouter);



app.get("/" , (req, res)=>{
  res.send("server is running")
})


server.listen(port , ()=>{
  connectDb();
  console.log(`Server started at PORT : ${port}`);
})




