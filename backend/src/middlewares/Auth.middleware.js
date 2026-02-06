import {ApiError} from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import {asyncHandler} from "../utils/asynchandler.js"

import User from "../models/User.model.js";

export const verifyJwt= asyncHandler(async(req, __,next)=>{
    try {
        const token= req.cookies?.accesstoken || req.header("Authorization")?.replace("Bearer","")

        if(!token){
            throw new ApiError(401,"Unauthorized access");

        }

        const decodeToken= jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);

        const user= await User.findById(decodeToken?._id).select(-refreshToken);

        if(!user){
            throw new ApiError(401,"Unauthorized access in user");
        }
    } catch (error) {
        throw new ApiError(401,"Invalid token")
    }
})