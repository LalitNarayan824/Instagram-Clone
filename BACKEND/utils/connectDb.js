import mongoose from "mongoose";

const connectDb = async ()=>{

  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Database is connected")
  } catch (error) {
    console.log("MONGODB ERROR :" + error);
  }

}
export default connectDb;