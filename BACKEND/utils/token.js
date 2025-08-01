import jwt from "jsonwebtoken"

const genToken = async (userId) =>{
  try {
    const token = await jwt.sign({userId} , process.env.JWT_SECRET , {expiresIn : "1y"});
    return token;
  } catch (error) {
    console.log(`error in generating token : ${error}`);
  }
}

export default genToken;