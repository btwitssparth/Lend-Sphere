import {asyncHandler} from '../utils/asynchandler.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { Product } from '../models/Product.model.js'
import {uploadOnCloudinary} from '../utils/Cloudinary.js'

//1. Add a new product
const addProduct= asyncHandler(async(requestAnimationFrame,res)=>{
    if(!req.user.roles.lending){
        throw new ApiError(403,"You must switch to lending role");

    }
    const {name,description,category,pricePerDay,location}= req.body;

    if ([name, description, category, location,pricePerDay].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    //handle image upload 
    const imageLocalPath= req.file?.path;
    if(!imageLocalPath){
        throw new ApiError(400,"Product image is required")
    }
    const productImage= await uploadOnCloudinary(imageLocalPath);
    if(!productImage){
        throw new ApiError(500,"Failed to upload product image")
    }

    const product= await Product.create({
        owner:req.user._id,
        name,
        description,
        category,
        pricePerDay,
        location,
        productImage:productImage.url
    });

    return res
    .status(201)
    .json(new ApiResponse(201,product,"Product added successfully"))
});

// get all products
const getAllproducts= asyncHandler(async(req,res)=>{
    // simple fetch will add pagination and search later

    const products= await Product.find({isAvailable:true}).sort({createdAt:-1});

    return res
    .status(200)
    .json(new ApiResponse(200,products,'products fetched successfully'));
});

export {addProduct,getAllproducts}

