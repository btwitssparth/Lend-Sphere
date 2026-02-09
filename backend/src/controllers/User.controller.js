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

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({ email });
  if (existedUser) {
    throw new ApiError(409, "User with this email already exists");
  }

  const hashedPassword = await hashPassword(password);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    roles: { renting: true, lending: false },
  });

  // ✅ THIS VARIABLE MUST EXIST
  const createdUser = await User.findById(user._id)
    .select("-password -refreshToken");

  if (!createdUser) {
    throw new ApiError(500, "User creation failed");
  }

  const { accessToken, refreshToken } =
    await generateAccessAndRefreshTokens(user._id);

  return res
    .status(201)
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    })
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    })
    .json(
      new ApiResponse(
        200,
        { user: createdUser },
        "User registered successfully"
      )
    );
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
  .cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000, // access token expiry
  })
  .cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // refresh token expiry
  })
  .json(
    new ApiResponse(
      200,
      { user: createdUser },
      "Authentication successful"
    )
  );

   

});

// Google OAuth Login

const googleLogin= asyncHandler(async(req,res)=>{
    const {credential}= req.body;
    if(!credential){
        throw new ApiError(400,"Credential is required");   

    }
    const ticket= await client.verifyIdToken({
        idToken:credential,
        audience:process.env.GOOGLE_CLIENT_ID,
    });
    const {name,email,sub:googleId}=ticket.getPayload();
    let user= await User.findOne({email});
    const randomPassword= Math.random().toString(36).slice(-8);
    const hashedPassword= await hashPassword(randomPassword);


    if(!user){
        // Create new user
        user = await User.create({
            name,
            email,
            password: hashedPassword,
            roles: { renting: true, lending: false }
        });
    }
    const {accessToken,refreshToken}= await generateAccessAndRefreshTokens(user._id);
    const loggedInUser= await User.findById(user._id).select('-password -refreshToken');

    return res
    .status(200)
    .cookie("accessToken",accessToken,cookieOptions )
    .cookie("refreshToken",refreshToken,cookieOptions)
    .json(new ApiResponse(200,{user:loggedInUser,accessToken,refreshToken},"Google login Successful"));

    
        
});

//logout user

const logoutUser= asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset:{refreshToken:1}
        },
        {new:true}
    );

    return res
    .status(200)
    .clearCookie("accessToken",cookieOptions)
    .clearCookie("refreshToken",cookieOptions)
    .json(new ApiResponse(200,null,"User logged out successfully"));
});

// Switch User Role

const switchUserRole= asyncHandler(async(req,res)=>{
    const user= await User.findById(req.user._id);
    if(!user){
        throw new ApiError(404,"User not found");
    }
    user.roles.lending = !user.roles.lending;
    await user.save({validateBeforeSave:false});
    return res
    .status(200)
    .json(new ApiResponse(200,user,`Role updated. Lender status: ${user.roles.lending}`))

});

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User fetched successfully"));
});

export{
    registerUser,
    loginUser,
    googleLogin,
    logoutUser,
    switchUserRole,
    getCurrentUser
    
};