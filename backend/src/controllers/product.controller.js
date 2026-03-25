import {asyncHandler} from '../utils/asynchandler.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { Product } from '../models/Product.model.js'
import {uploadOnCloudinary} from '../utils/Cloudinary.js'

// 1. Add a new product
const addProduct = asyncHandler(async(req, res) => {
    // 🔥 Added quantity
    const {name, description, category, pricePerDay, location, latitude, longitude, quantity} = req.body;

    if ([name, description, category, location, pricePerDay].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    if (!req.files || req.files.length === 0) {
        throw new ApiError(400, "At least one product image is required");
    }

    const imageLocalPaths = req.files.map(file => file.path);

    const uploadPromises = imageLocalPaths.map(path => uploadOnCloudinary(path));
    const uploadedImages = await Promise.all(uploadPromises);

    const productImages = uploadedImages
        .filter(image => image !== null)
        .map(image => image.secure_url || image.url);

    if(productImages.length === 0){
        throw new ApiError(500, "Failed to upload product images");
    }

    const product = await Product.create({
        owner: req.user._id,
        name,
        description,
        category,
        pricePerDay,
        location,
        productImages,
        quantity: quantity || 1, // 🔥 Save Quantity
        geoLocation: {
            type: 'Point',
            coordinates: [
                parseFloat(longitude || 0),
                parseFloat(latitude || 0)
            ]
        }
    });

    return res.status(201).json(new ApiResponse(201, product, "Product added successfully"));
});

// 2. get all products
const getAllProducts = asyncHandler(async(req,res)=>{
    const {search, category, minPrice, maxPrice, lat, lng, location, radius} = req.query;
    const filter = { isAvailable: true };

    if(search) filter.name = { $regex: search, $options: "i" };
    if(category) filter.category = category;
    
    const maxDistanceMeters = radius ? Number(radius) * 1000 : 5000;

    if (lat && lng) {
        filter.geoLocation = {
            $near: {
                $geometry: {
                    type: "Point",
                    coordinates: [parseFloat(lng), parseFloat(lat)]
                },
                $maxDistance: maxDistanceMeters 
            }
        };
    } else if (location) {
        filter.location = { $regex: location, $options: "i" };
    }

    const products = await Product.find(filter).sort(lat && lng ? {} : {createdAt: -1});
    return res.status(200).json(new ApiResponse(200, products, "Product Fetched Successfully"));
});

// 3. Get Single Product
const getProductById= asyncHandler(async(req,res)=>{
    const {id}= req.params;
    const product= await Product.findById(id).populate("owner","name email");

    if(!product){
        throw new ApiError(404,"Product not found");
    }
    return res.status(200).json(new ApiResponse(200,product,"Product fetched Successfully"));
});

// 4. Update Product
const updateProduct = asyncHandler(async(req,res)=>{
    const {id}= req.params;
    const {name,description,category,pricePerDay,location,isAvailable, quantity}= req.body;

    let product = await Product.findById(id);

    if(!product){
        throw new ApiError(404,"Product not found");
    }

    if(product.owner.toString() !== req.user._id.toString()){
        throw new ApiError(401,"You are not authorized to update this product")
    }

    if(name) product.name=name;
    if(description) product.description=description;
    if(category) product.category=category;
    if(pricePerDay) product.pricePerDay=pricePerDay;
    if(location) product.location=location;
    if(quantity) product.quantity=quantity; 
    if(isAvailable !== undefined) product.isAvailable=isAvailable;

    if(req.files && req.files.length > 0){
        const imageLocalPaths = req.files.map(file => file.path);
        const uploadPromises = imageLocalPaths.map(path => uploadOnCloudinary(path));
        const uploadedImages = await Promise.all(uploadPromises);
        
        const newImages = uploadedImages
            .filter(image => image !== null)
            .map(image => image.secure_url || image.url);

        if(newImages.length > 0){
            product.productImages = newImages;
        }
    }
    
    await product.save();
    return res.status(200).json(new ApiResponse(200,product,"Product updated successfully"))
});

// 5. Delete Product
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
    return res.status(200).json(new ApiResponse(200,{},"Product deleted successfully"))
});

// 🔥 6. Get My Listings (RESTORED THIS FUNCTION!)
const getMyListings = asyncHandler(async(req, res) => {
    // Find all products where the owner is the currently logged-in user
    const products = await Product.find({ owner: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json(new ApiResponse(200, products, "My listings fetched successfully"));
});

// 🔥 Make sure getMyListings is exported here
export { addProduct, getAllProducts, getProductById, updateProduct, deleteProduct, getMyListings }