import { asyncHandler } from '../utils/asynchandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import User from '../models/User.model.js';
import { hashPassword, comparePassword } from '../utils/password.utils.js';
import { generateAccessAndRefreshTokens } from '../utils/token.js';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import axios from 'axios'; // <--- REQUIRED: Import axios
import {uploadOnCloudinary} from '../utils/Cloudinary.js'

// Initialize Google OAuth2 Client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
};

// ================== REGISTER USER ==================
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) throw new ApiError(400, "All fields are required");

    const existedUser = await User.findOne({ email });
    if (existedUser) throw new ApiError(409, "User with this email already exists");

    const hashedPassword = await hashPassword(password);
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        roles: { renting: true, lending: false },
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");
    if (!createdUser) throw new ApiError(500, "User creation failed");

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    return res.status(201)
        .cookie("accessToken", accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 })
        .cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 })
        .json(new ApiResponse(201, { user: createdUser }, "User registered successfully"));
});

// ================== LOGIN USER ==================
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) throw new ApiError(400, "Email and password are required");

    const user = await User.findOne({ email }).select('+password');
    if (!user) throw new ApiError(401, "Invalid email or password");

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) throw new ApiError(401, "Invalid email or password");

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
    const loggedInUser = await User.findById(user._id).select('-password -refreshToken');

    return res.status(200)
        .cookie("accessToken", accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 })
        .cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 })
        .json(new ApiResponse(200, { user: loggedInUser }, "Login successful"));
});

// ================== GOOGLE OAUTH LOGIN (UPDATED) ==================
const googleLogin = asyncHandler(async (req, res) => {
    const { credential } = req.body;
    if (!credential) throw new ApiError(400, "Google credential is required");

    let name, email, googleId;

    try {
        // STRATEGY 1: Verify as ID Token (Standard Google Button)
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        name = payload.name;
        email = payload.email;
        googleId = payload.sub;

    } catch (idTokenError) {
        // STRATEGY 2: Verify as Access Token (Custom Button via axios)
        try {
            const userInfoResponse = await axios.get(
                "https://www.googleapis.com/oauth2/v3/userinfo",
                { headers: { Authorization: `Bearer ${credential}` } }
            );
            name = userInfoResponse.data.name;
            email = userInfoResponse.data.email;
            googleId = userInfoResponse.data.sub;
        } catch (accessTokenError) {
            throw new ApiError(401, "Invalid Google Credential");
        }
    }

    let user = await User.findOne({ email });

    if (!user) {
        const randomPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await hashPassword(randomPassword);
        user = await User.create({
            name,
            email,
            password: hashedPassword,
            roles: { renting: true, lending: false }
        });
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
    const loggedInUser = await User.findById(user._id).select('-password -refreshToken');

    return res.status(200)
        .cookie("accessToken", accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 })
        .cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 })
        .json(new ApiResponse(200, { user: loggedInUser }, "Google login successful"));
});

// ================== LOGOUT USER ==================
const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } }, { new: true });
    return res.status(200)
        .clearCookie("accessToken", cookieOptions)
        .clearCookie("refreshToken", cookieOptions)
        .json(new ApiResponse(200, null, "User logged out successfully"));
});

// ================== GET CURRENT USER ==================
const getCurrentUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select("-password -refreshToken");
    if (!user) throw new ApiError(404, "User not found");
    return res.status(200).json(new ApiResponse(200, user, "User fetched successfully"));
});

// ================== SWITCH USER ROLE ==================
const switchUserRole = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) throw new ApiError(404, "User not found");
    user.roles.lending = !user.roles.lending;
    await user.save({ validateBeforeSave: false });
    return res.status(200).json(new ApiResponse(200, { roles: user.roles, isLender: user.roles.lending }, `Role updated.`));
});

// ================== REFRESH ACCESS TOKEN ==================
const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!incomingRefreshToken) throw new ApiError(401, "Refresh token is required");

    try {
        const decoded = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decoded._id);
        if (!user || incomingRefreshToken !== user.refreshToken) throw new ApiError(401, "Invalid refresh token");

        const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshTokens(user._id);
        return res.status(200)
            .cookie("accessToken", accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 })
            .cookie("refreshToken", newRefreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 })
            .json(new ApiResponse(200, { accessToken, refreshToken: newRefreshToken }, "Access token refreshed"));
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token");
    }
});

// ================== UPDATE USER PROFILE ==================
const updateUserProfile = asyncHandler(async (req, res) => {
    const { name } = req.body;
    if (!name || name.trim().length === 0) throw new ApiError(400, "Name is required");
    const user = await User.findByIdAndUpdate(req.user._id, { $set: { name: name.trim() } }, { new: true, runValidators: true }).select("-password -refreshToken");
    if (!user) throw new ApiError(404, "User not found");
    return res.status(200).json(new ApiResponse(200, user, "Profile updated successfully"));
});

// ================== CHANGE PASSWORD ==================
const changePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) throw new ApiError(400, "Old password and new password are required");
    if (newPassword.length < 6) throw new ApiError(400, "New password must be at least 6 characters");
    const user = await User.findById(req.user._id).select('+password');
    if (!user) throw new ApiError(404, "User not found");
    const isPasswordCorrect = await comparePassword(oldPassword, user.password);
    if (!isPasswordCorrect) throw new ApiError(400, "Old password is incorrect");
    user.password = await hashPassword(newPassword);
    await user.save({ validateBeforeSave: false });
    return res.status(200).json(new ApiResponse(200, null, "Password changed successfully"));
});

const uploadIdentityProof = asyncHandler(async(req,res)=>{
    const idLocalPath = req.file?.path;
    if(!idLocalPath){
        throw new ApiError(400, "Identity proof file is required");
    }

    const idImage = await uploadOnCloudinary(idLocalPath);
    if(!idImage){
        throw new ApiError(500, "Failed to upload identity proof");
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            identityProof: idImage.secure_url,
            hasUploadedID: true,
        },
        { new: true }
    ).select("-password");
    return res
    .status(200)
    .json(new ApiResponse(200,user))
})

export { registerUser, loginUser, googleLogin, logoutUser, getCurrentUser, switchUserRole, refreshAccessToken, updateUserProfile, changePassword,uploadIdentityProof };