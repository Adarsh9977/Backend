import  {User}  from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import  jwt  from "jsonwebtoken"




export const verifyJWT = asyncHandler(async(req, _,next)=>{
   try {
    const token =  req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "")
 
   //  console.log(token);
    if(!token){
     throw new ApiError(401, "unauthorized request")
    }
 
   const decodedToken =  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
 
   // console.log(decodedToken);

    const user = await User.findById(decodedToken?.id).select("-password -refreshToken")
   // console.log(user);
   
    if(!user){
     throw new ApiError(401, "Invalllid Access Token")
    }
 
    req.user = user;
    next();
    
   } catch (error) {
    throw new ApiError(401, error?.message || "invalid Access Token")
   }
})