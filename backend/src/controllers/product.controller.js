import {asyncHandler} from '../utils/asynchandler.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { Product } from '../models/Product.model.js'
import {uploadOnCloudinary} from '../utils/Cloudinary.js'

//1. Add a new product
const addProduct= asyncHandler(async(req,res)=>{
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
const getAllProducts= asyncHandler(async(req,res)=>{
    const {search,category,minPrice,maxPrice}=req.query;
    const filter={isAvailable:true};

    if(search){
        filter.name={$regex:search,$options:"i"};
    }
    if(category){
        filter.category=category;
    }
    if(minPrice || maxPrice){
        filter.pricePerDay={};
        if(minPrice)filter.pricePerDay.$gte = Number(minPrice);
        if(maxPrice)filter.pricePerDay.$lte = Number(maxPrice);

    }

    const products = await Product.find(filter).sort({createdAt:-1});
    return res
    .status(200)
    .json(new ApiResponse(200,products,"Product Fetched Successfully"));

});

// Get Single Product
const getProductById= asyncHandler(async(req,res)=>{
    const {id}= req.params;
    const product= await Product.findById(id).populate("owner","name email");

    if(!product){
        throw new ApiError(404,"Product not found");
    }
    return res
    .status(200)
    .json(new ApiResponse(200,product,"Product fetched Successfully"));

})

//Update Product
const updateProduct = asyncHandler(async(req,res)=>{
    const {id}= req.params;
    const {name,description,category,pricePerDay,location,isAvailable}= req.body;

    let product = await Product.findById(id);

    if(!product){
        throw new ApiError(404,"Product not found");
    }

    if(product.owner.toString() !== req.user._id.toString()){
        throw new ApiError(401,"You are not authorized to update this product")
    }

    //Update fields if provided
    if(name) product.name=name;
    if(description) product.description=description;
    if(category) product.category=category;
    if(pricePerDay) product.pricePerDay=pricePerDay;
    if(location) product.location=location;
    if(isAvailable !== undefined) product.isAvailable=isAvailable;

    if(req.file){
        const imageLocalPath= req.file.path;
        const productImage= await uploadOnCloudinary(imageLocalPath);
        if(!productImage){
            throw new ApiError(500,"Failed to upload product image")
        }
        if(productImage){
            product.productImage=productImage.url;
        }
    }
    await product.save();
    return res
    .status(200)
    .json(new ApiResponse(200,product,"Product updated successfully"))
});

// Delete Product
const deleteProduct = asyncHandler(async(req,res)=>{
    const {id}= req.params;
    const product = await Product.findById(id);
    if(!product){
        throw new ApiError(404,"Product not found");
    }

    if(product.owner.toString()!== req.user._id.toString()){
        throw new ApiError(401,"You are not authorized to delete this product")
    }
    await Product.findByIdAndDelete(id);
    return res
    .status(200)
    .json(new ApiResponse(200,{},"Product deleted successfully"))
})

export {addProduct,getAllProducts,getProductById,updateProduct,deleteProduct}

