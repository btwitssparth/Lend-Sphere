import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Dispute } from "../models/Dispute.model.js";
import { Rental } from "../models/Rental.model.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";

// 1. Raise a Dispute
const createDispute = asyncHandler(async (req, res) => {
    const { rentalId, reason, description, claimAmount } = req.body;
    
    // Fetch rental to verify ownership
    const rental = await Rental.findById(rentalId).populate('product');
    if (!rental) throw new ApiError(404, "Rental not found");

    // Ensure only the Lender can raise a dispute (for now)
    if (rental.product.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Only the lender can report damage");
    }

    // Ensure rental is completed or active
    if (!['Active', 'Completed'].includes(rental.status)) {
        throw new ApiError(400, "You can only dispute active or completed rentals");
    }

    // Handle Image Uploads
    const imageLocalPaths = req.files?.map(file => file.path);
    if (!imageLocalPaths || imageLocalPaths.length === 0) {
        throw new ApiError(400, "At least one proof image is required");
    }

    const uploadPromises = imageLocalPaths.map(path => uploadOnCloudinary(path));
    const uploadedImages = await Promise.all(uploadPromises);
    const proofImages = uploadedImages.filter(img => img !== null).map(img => img.url);

    const dispute = await Dispute.create({
        rental: rentalId,
        raiser: req.user._id,
        defendant: rental.renter,
        reason,
        description,
        claimAmount,
        proofImages
    });

    // Optionally update rental status to indicate a dispute
    rental.status = "Completed"; // Ensure it's marked returned so it doesn't accrue late fees
    await rental.save();

    return res.status(201).json(new ApiResponse(201, dispute, "Dispute raised successfully"));
});

// 2. Get Disputes for a Lender
const getMyDisputes = asyncHandler(async (req, res) => {
    const disputes = await Dispute.find({ raiser: req.user._id })
        .populate("rental")
        .populate("defendant", "name email")
        .sort("-createdAt");
    
    return res.status(200).json(new ApiResponse(200, disputes, "Disputes fetched successfully"));
});

// 3. Get Dispute by Rental ID (to show status on dashboard)
const getDisputeByRental = asyncHandler(async (req, res) => {
    const { rentalId } = req.params;
    const dispute = await Dispute.findOne({ rental: rentalId });
    // If no dispute found, return null (not an error, just means no dispute)
    return res.status(200).json(new ApiResponse(200, dispute || null, "Fetched dispute status"));
});

export { createDispute, getMyDisputes, getDisputeByRental };