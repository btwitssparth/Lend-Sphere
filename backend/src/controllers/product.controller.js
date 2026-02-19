import {asyncHandler} from '../utils/asynchandler.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { Product } from '../models/Product.model.js'
import {uploadOnCloudinary} from '../utils/Cloudinary.js'

//1. Add a new product
// backend/src/controllers/product.controller.js

const addProduct = asyncHandler(async(req, res) => {
    if(!req.user.roles.lending){
        throw new ApiError(403,"You must switch to lending role");
    }
    
    const {name, description, category, pricePerDay, location} = req.body;

    if ([name, description, category, location, pricePerDay].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    // 1. Check for multiple files instead of a single file
    const imageLocalPaths = req.files?.map(file => file.path);
    if(!imageLocalPaths || imageLocalPaths.length === 0){
        throw new ApiError(400, "At least one product image is required");
    }

    // 2. Upload all images concurrently to Cloudinary
    const uploadPromises = imageLocalPaths.map(path => uploadOnCloudinary(path));
    const uploadedImages = await Promise.all(uploadPromises);

    // 3. Extract the URLs and filter out any failed uploads
    const productImages = uploadedImages
        .filter(image => image !== null)
        .map(image => image.url);

    if(productImages.length === 0){
        throw new ApiError(500, "Failed to upload product images");
    }

    // 4. Save to database using the new array field
    const product = await Product.create({
        owner: req.user._id,
        name,
        description,
        category,
        pricePerDay,
        location,
        productImages // Using the array of URLs here
    });

    return res
    .status(201)
    .json(new ApiResponse(201, product, "Product added successfully"));
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
// backend/src/controllers/product.controller.js

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

    // Handle multiple images if new ones are uploaded
    if(req.files && req.files.length > 0){
        const imageLocalPaths = req.files.map(file => file.path);
        const uploadPromises = imageLocalPaths.map(path => uploadOnCloudinary(path));
        const uploadedImages = await Promise.all(uploadPromises);
        
        const newImages = uploadedImages
            .filter(image => image !== null)
            .map(image => image.url);

        if(newImages.length > 0){
            // This replaces the old images with the new ones
            product.productImages = newImages;
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

