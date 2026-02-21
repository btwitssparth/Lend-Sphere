import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Review } from "../models/Review.model.js";
import { Rental } from "../models/Rental.model.js";

// submit a review

const addReview= asyncHandler(async(req,res)=>{
    const { rentalId, rating, comment } = req.body;
    
    const userId= req.user._id.toString();

    if(!rating || !comment) throw new ApiError(400,"Rating and comment are required");

    const rental = await Rental.findById(rentalId).populate("product")
    if(!rental) throw new ApiError(404,"Rental not found");

    const renterId = rental.renter._id ? rental.renter._id.toString() : rental.renter.toString()

    // security rules
    if(renterId !== userId){
        throw new ApiError(403,"Only the renter can leave a review");

    }

    // we only allow reviews for completed rentals for fake reviews

    if(rental.status !=="Completed"){
        throw new ApiError(403,"Reviews can only be left for completed rentals");
    }

    const existingReview = await Review.findOne({rental:rentalId});
    if(existingReview){
        throw new ApiError(400,"Review already exists for this rental");
    }

    const review = await Review.create({
        product: rental.product._id,
        rental: rental._id,
        reviewer: userId,
        rating: Number(rating),
        comment
    });
    rental.isReviewed = true;
    rental.review = review._id;
    await rental.save();

    return res.status(201).json(new ApiResponse(201,review,"Review submitted successfully"));
});

// GetAll reviews for a product

const getProductReviews = asyncHandler(async (req, res) => {
    const { productId } = req.params;

    const reviews = await Review.find({ product: productId })
        .populate("reviewer", "name")
        .sort({ createdAt: -1 });

    // Dynamically calculate the average rating on the fly
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0 
        ? (reviews.reduce((acc, item) => item.rating + acc, 0) / totalReviews).toFixed(1) 
        : 0;

    return res.status(200).json(
        new ApiResponse(200, { reviews, totalReviews, averageRating }, "Reviews fetched")
    );
});

export { addReview, getProductReviews };