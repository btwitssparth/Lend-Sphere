import User from "../models/User.model.js";
import { generateAccessToken, generateRefreshToken } from "./jwt.util.js"

export const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);

        const accessToken = generateAccessToken({ _id: user._id });
        const refreshToken = generateRefreshToken({ _id: user._id });

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false }); // Capital 'V' changed to lowercase 'v'
        return { accessToken, refreshToken };

    } catch (error) {
        throw new Error("Error generating tokens");
    }
}