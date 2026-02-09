import { asyncHandler } from '../utils/asynchandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import User from '../models/User.model.js';
import { uploadOnCloudinary } from '../utils/Cloudinary.js';
import { hashPassword, comparePassword } from '../utils/password.utils.js';
import { generateAccessAndRefreshTokens } from '../utils/token.js';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';

// Initialize Google OAuth2 Client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Cookie configuration
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
};

// ================== REGISTER USER ==================
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
        throw new ApiError(400, "All fields are required");
    }

    // Check if user already exists
    const existedUser = await User.findOne({ email });
    if (existedUser) {
        throw new ApiError(409, "User with this email already exists");
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        roles: { renting: true, lending: false },
    });

    // Fetch created user without sensitive fields
    const createdUser = await User.findById(user._id)
        .select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "User creation failed");
    }

    // Generate tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    // Send response with cookies
    return res
        .status(201)
        .cookie("accessToken", accessToken, {
            ...cookieOptions,
            maxAge: 15 * 60 * 1000, // 15 minutes
        })
        .cookie("refreshToken", refreshToken, {
            ...cookieOptions,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        })
        .json(
            new ApiResponse(
                201,
                { user: createdUser },
                "User registered successfully"
            )
        );
});

// ================== LOGIN USER ==================
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }

    // Find user with password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        throw new ApiError(401, "Invalid email or password");
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid email or password");
    }

    // Generate tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    // Fetch user without sensitive fields
    const loggedInUser = await User.findById(user._id)
        .select('-password -refreshToken');

    // Send response with cookies
    return res
        .status(200)
        .cookie("accessToken", accessToken, {
            ...cookieOptions,
            maxAge: 15 * 60 * 1000, // 15 minutes
        })
        .cookie("refreshToken", refreshToken, {
            ...cookieOptions,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        })
        .json(
            new ApiResponse(
                200,
                { user: loggedInUser },
                "Login successful"
            )
        );
});

// ================== GOOGLE OAUTH LOGIN ==================
const googleLogin = asyncHandler(async (req, res) => {
    const { credential } = req.body;

    // Validate credential
    if (!credential) {
        throw new ApiError(400, "Google credential is required");
    }

    // Verify Google token
    const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { name, email, sub: googleId } = ticket.getPayload();

    // Check if user exists
    let user = await User.findOne({ email });

    // Create new user if doesn't exist
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

    // Generate tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    // Fetch user without sensitive fields
    const loggedInUser = await User.findById(user._id)
        .select('-password -refreshToken');

    // Send response with cookies
    return res
        .status(200)
        .cookie("accessToken", accessToken, {
            ...cookieOptions,
            maxAge: 15 * 60 * 1000, // 15 minutes
        })
        .cookie("refreshToken", refreshToken, {
            ...cookieOptions,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        })
        .json(
            new ApiResponse(
                200,
                { user: loggedInUser },
                "Google login successful"
            )
        );
});

// ================== LOGOUT USER ==================
const logoutUser = asyncHandler(async (req, res) => {
    // Remove refresh token from database
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: { refreshToken: 1 }
        },
        { new: true }
    );

    // Clear cookies and send response
    return res
        .status(200)
        .clearCookie("accessToken", cookieOptions)
        .clearCookie("refreshToken", cookieOptions)
        .json(
            new ApiResponse(
                200,
                null,
                "User logged out successfully"
            )
        );
});

// ================== GET CURRENT USER ==================
const getCurrentUser = asyncHandler(async (req, res) => {
    // Fetch current user from database
    const user = await User.findById(req.user._id)
        .select("-password -refreshToken");

    // Validate user exists
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Send response
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                user,
                "User fetched successfully"
            )
        );
});

// ================== SWITCH USER ROLE ==================
const switchUserRole = asyncHandler(async (req, res) => {
    // Find user
    const user = await User.findById(req.user._id);
    
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Toggle lending role
    user.roles.lending = !user.roles.lending;
    await user.save({ validateBeforeSave: false });

    // Send response
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { 
                    roles: user.roles,
                    isLender: user.roles.lending 
                },
                `Role updated. Lender status: ${user.roles.lending}`
            )
        );
});

// ================== REFRESH ACCESS TOKEN ==================
const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Refresh token is required");
    }

    try {
        // Verify refresh token
        const decoded = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        // Find user
        const user = await User.findById(decoded._id);

        if (!user) {
            throw new ApiError(401, "Invalid refresh token");
        }

        // Check if refresh token matches
        if (incomingRefreshToken !== user.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used");
        }

        // Generate new tokens
        const { accessToken, refreshToken: newRefreshToken } = 
            await generateAccessAndRefreshTokens(user._id);

        // Send response with new tokens
        return res
            .status(200)
            .cookie("accessToken", accessToken, {
                ...cookieOptions,
                maxAge: 15 * 60 * 1000,
            })
            .cookie("refreshToken", newRefreshToken, {
                ...cookieOptions,
                maxAge: 7 * 24 * 60 * 60 * 1000,
            })
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "Access token refreshed"
                )
            );
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token");
    }
});

// ================== UPDATE USER PROFILE ==================
const updateUserProfile = asyncHandler(async (req, res) => {
    const { name } = req.body;

    // Validate name
    if (!name || name.trim().length === 0) {
        throw new ApiError(400, "Name is required");
    }

    // Update user
    const user = await User.findByIdAndUpdate(
        req.user._id,
        { 
            $set: { name: name.trim() } 
        },
        { 
            new: true,
            runValidators: true 
        }
    ).select("-password -refreshToken");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Send response
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                user,
                "Profile updated successfully"
            )
        );
});

// ================== CHANGE PASSWORD ==================
const changePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    // Validate fields
    if (!oldPassword || !newPassword) {
        throw new ApiError(400, "Old password and new password are required");
    }

    // Validate new password length
    if (newPassword.length < 6) {
        throw new ApiError(400, "New password must be at least 6 characters");
    }

    // Find user with password
    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Verify old password
    const isPasswordCorrect = await comparePassword(oldPassword, user.password);

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Old password is incorrect");
    }

    // Hash and save new password
    user.password = await hashPassword(newPassword);
    await user.save({ validateBeforeSave: false });

    // Send response
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                null,
                "Password changed successfully"
            )
        );
});

// ================== EXPORTS ==================
export {
    registerUser,
    loginUser,
    googleLogin,
    logoutUser,
    getCurrentUser,
    switchUserRole,
    refreshAccessToken,
    updateUserProfile,
    changePassword
};
