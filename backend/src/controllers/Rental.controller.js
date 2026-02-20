import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Rental } from "../models/Rental.model.js";
import { Product } from "../models/Product.model.js";

// 1. Rent a Product 
const rentItem = asyncHandler(async (req, res) => {
    const { productId, startDate, endDate } = req.body;

    if (!productId || !startDate || !endDate) {
        throw new ApiError(400, "All fields are required");
    }

    // STRIP TIME: Set everything to exactly midnight to prevent timezone bugs
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    
    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Date Validations
    if (start < today) {
        throw new ApiError(400, "Start date cannot be in the past");
    }
    if (end <= start) {
        throw new ApiError(400, "End date must be after start date");
    }

    const product = await Product.findById(productId);

    if (!product) {
        throw new ApiError(404, "Product not found");
    }
    
    if (!product.isAvailable) {
        throw new ApiError(400, "Product is currently not available for rent");
    }

    if (product.owner.toString() === req.user._id.toString()) {
        throw new ApiError(400, "You cannot rent your own product");
    }

    // --- FIXED: "Approved" instead of "Accepted" ---
    const conflictingRentals = await Rental.find({
        product: productId,
        status: { $in: ['Pending', 'Approved', 'Active'] }, // Fixed Enum!
        $or: [
            { startDate: { $lte: start }, endDate: { $gte: start } },
            { startDate: { $lte: end }, endDate: { $gte: end } },
            { startDate: { $gte: start }, endDate: { $lte: end } }
        ]
    });

    if (conflictingRentals.length > 0) {
        throw new ApiError(409, "These dates are already booked for this item");
    }

    // Calculate total price accurately
    const timeDiff = end.getTime() - start.getTime();
    const days = Math.ceil(timeDiff / (1000 * 3600 * 24));
    const totalDays = days === 0 ? 1 : days; 
    const totalPrice = totalDays * product.pricePerDay;

    const rental = await Rental.create({
        renter: req.user._id,
        product: productId,
        startDate: start,
        endDate: end,
        totalPrice,
        status: "Pending"
    });

    return res
        .status(201)
        .json(new ApiResponse(201, rental, "Rental request sent successfully"));
});

// 2. Get Unavailable Dates 
const getUnavailableDates = asyncHandler(async (req, res) => {
    const { productId } = req.params;

    if (!productId) {
        throw new ApiError(400, "Product ID is required");
    }

    // STRIP TIME so we don't accidentally hide today's bookings
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const rentals = await Rental.find({
        product: productId,
        endDate: { $gte: today }, 
        status: { $in: ['Pending', 'Approved', 'Active'] } // Fixed Enum!
    }).select('startDate endDate -_id'); 

    return res
        .status(200)
        .json(new ApiResponse(200, rentals, "Unavailable dates fetched successfully"));
});

// 3. Get My Rentals (Items I have rented)
const getMyRentals = asyncHandler(async (req, res) => {
    const rentals = await Rental.find({ renter: req.user._id })
        .populate("product", "name productImage pricePerDay productImages")
        .sort({ createdAt: -1 });

    return res
        .status(200)
        .json(new ApiResponse(200, rentals, "My rentals fetched Successfully"));
});

// 4. Get Rentals for my products (Lender View)
const getLenderRentals = asyncHandler(async(req, res)=>{
    const rentals = await Rental.find()
        .populate({
            path: "product",
            match: { owner: req.user._id },
            select: "name pricePerDay productImage productImages"
        })
        .populate("renter", "name email identityProof")
        .sort({ createdAt: -1 });

    const myLendingRequests = rentals.filter(rental => rental.product !== null);

    return res
        .status(200)
        .json(new ApiResponse(200, myLendingRequests, "Incoming rental requests fetched"));
});

// 5. Update Rental Status
const updateRentalStatus = asyncHandler(async(req, res)=>{
    const { rentalId, status } = req.body;

    const rental = await Rental.findById(rentalId).populate("product");
    
    if(!rental){
        throw new ApiError(404, "Rental request not found");
    }

    if(rental.product.owner.toString() !== req.user._id.toString()){
        throw new ApiError(403, "You can only manage rentals for your own products");
    }

    rental.status = status;
    await rental.save();

    return res
        .status(200)
        .json(new ApiResponse(200, rental, `Rental status updated to ${status}`));
});

export { rentItem, getUnavailableDates, getMyRentals, getLenderRentals, updateRentalStatus };