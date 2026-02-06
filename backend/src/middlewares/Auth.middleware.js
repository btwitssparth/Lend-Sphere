import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asynchandler.js";

// FIX 1: Remove brackets (Default import)
import User from "../models/User.model.js"; 

export const verifyJwt = asyncHandler(async(req, __, next) => {
    try {
        // FIX 2: Check for 'accessToken' (camelCase) to match your Controller
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(401, "Unauthorized access");
        }

        const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodeToken?._id).select("-refreshToken");

        if (!user) {
            throw new ApiError(401, "Unauthorized access in user");
        }
        
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid token");
    }
});