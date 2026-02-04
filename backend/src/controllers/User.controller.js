import {asyncHandler} from '../utils/asynchandler.js'
import {ApiError} from '../utils/ApiError.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import User from '../models/User.model.js'
import {uploadOnCloudinary} from '../utils/Cloudinary.js'
import { hashPassword,comparePassword } from '../utils/password.utils.js'
import { generateAccessAndRefreshTokens } from '../utils/token.js'
import {OAuth2Client} from 'google-auth-library'


// Initialize Google OAuth2 Client

const client= new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const cookieOptions= {
    httpOnly:true,
    secure:process.env.NODE_ENV==='production',
};

const registerUser= asyncHandler(async(req,res)=>{
    const {name,email,password}=req.body;

    if ([name,email,password].some((field)=>field?.trim()==='')){
        throw new ApiError(400,"All fields are required");
    }

    const existedUser= await User.findOne({email});
    if (existedUser){
        throw new ApiError(409,"User with this email already exists");
    }

    const hashedPassword= await hashPassword(password);

    const user= await User.create({
        name,
        email,
        password:hashedPassword,
        roles:{renting:true,lending:false}
    });

    const createdUser = await User.findById(user._id).select('password -refreshToken');

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while creating the user");

    }
    //Auto-login after registration

    const {accessToken,refreshToken}= await generateAccessAndRefreshTokens(user._id);
    return res
    .status(201)
    .cookie("accessToken",accessToken,cookieOptions)
    .cookie("refreshToken",refreshToken,cookieOptions)
    .json(new ApiResponse(200,createdUser,"User registered successfully"))
    
});

const loginUser= asyncHandler(async(req,res)=>{
    const {email,password}=req.body;

    if(!email|| !password){
        throw new ApiError(400,"Email and password are required");

    }
    const user= await User.findOne({email}).select('+password');
    if(!user){
        throw new ApiError(401,"Invalid email or password");
    }

    const isPasswordValid= await comparePassword(password,user.password);

    if(!isPasswordValid){
        throw new ApiError(401,"Invalid email or password");

    }

    const {accessToken,refreshToken}= await generateAccessAndRefreshTokens(user._id);

    const loggedInUser= await User.findById(user._id).select('-password -refreshToken');

    return res
    .status(200)
    .cookie("accessToken",accessToken,cookieOptions)
    .cookie("refreshToken",refreshToken,cookieOptions)
    .json(new ApiResponse(200,{user:loggedInUser,accessToken,refreshToken},"User logged in successfully"));

});