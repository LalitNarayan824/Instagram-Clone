import jwt from "jsonwebtoken";

const isAuth = async (req ,res , next)=>{
  try {
    const token = req.cookies.token

    if(!token){
      return res.status(400).json({message : "token not found !"});
    }

    const verifiedToken = await jwt.verify(token , process.env.JWT_SECRET);

    if(!verifiedToken){
       return res.status(400).json({message : "user not found in token !"});
    }

    req.userId = verifiedToken.userId

    next();
  } catch (error) {
     return res.status(500).json({message : `is auth error : ${error}`});
  }
}

export default isAuth;