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

export { rentItem, getMyRentals };