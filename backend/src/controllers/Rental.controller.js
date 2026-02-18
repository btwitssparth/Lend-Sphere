import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Rental } from "../models/Rental.model.js";
import { Product } from "../models/Product.model.js";

// Rent a Product (Creating a rent request)
const rentItem = asyncHandler(async (req, res) => {
    // FIX 1: Correct spelling of 'productId'
    const { productId, startDate, endDate } = req.body;

    if (!productId || !startDate || !endDate) {
        // FIX 2: Correct order (StatusCode first, then Message)
        throw new ApiError(400, "All fields are required");
    }

    const product = await Product.findById(productId);

    if (!product) {
        throw new ApiError(404, "Product not found");
    }
    
    // Check availability (optional, depending on your logic)
     if (!product.isAvailable) {
        throw new ApiError(400, "Product is not available for rent");
     }

    if (product.owner.toString() === req.user._id.toString()) {
        throw new ApiError(400, "You cannot rent your own product");
    }

    // Calculate total price
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();
    
    // Convert ms to days
    const days = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (days <= 0) {
        throw new ApiError(400, "End date must be after start date");
    }

    const totalPrice = days * product.pricePerDay;

    const rental = await Rental.create({
        renter: req.user._id,
        product: productId, // Uses the corrected variable name
        startDate,
        endDate,
        totalPrice,
        status: "Pending"
    });

    return res
        .status(201)
        .json(new ApiResponse(201, rental, "Rental request sent successfully"));
});

// 2. Get My Rentals (Items I have rented)
const getMyRentals = asyncHandler(async (req, res) => {
    const rentals = await Rental.find({ renter: req.user._id })
        .populate("product", "name productImage pricePerDay")
        .sort({ createdAt: -1 });

    return res
        .status(200)
        .json(new ApiResponse(200, rentals, "My rentals fetched Successfully"));
});

//3 Get Rentals for my products (Lender View)

const getLenderRentals= asyncHandler(async(req,res)=>{
    const rentals = await Rental.find()
    .populate({
        path: "product",
        match:{owner:req.user._id},
        select:"name pricePerDay"
    })
    .populate("renter","name email identityProof")
    .sort({createdAt:-1});

    const myLendingRequests= rentals.filter(rental=>rental.product !== null);

    return res
    .status(200)
    .json(new ApiResponse(200,myLendingRequests,"Incoming rental requests fetched"));
});

// 4 update Rental Status (Accept/Reject)
const updateRentalStatus = asyncHandler(async(req,res)=>{
    const {rentalId,status}= req.body;

    const rental = await Rental.findById(rentalId).populate("product");
    if(!rental){
        throw new ApiError(404,"Rental request not found");
    }

    //verify that the logged in user is the owner of the product
    if(rental.product.owner.toString()!== req.user._id.toString()){
        throw new ApiError(403,"You can only manage rentals for your own products")

    }
    rental.status= status;
    await rental.save();

    return res
    .status(200)
    .json(new ApiResponse(200,rental,`Rental status updated to ${status}`));
});

export { rentItem, getMyRentals,getLenderRentals,updateRentalStatus };