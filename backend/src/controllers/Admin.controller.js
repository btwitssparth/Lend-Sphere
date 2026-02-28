import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Dispute } from "../models/Dispute.model.js";
import  User from '../models/User.model.js'     // 🔥 Import User Model

// 1. Get ALL Disputes
const getAllDisputes = asyncHandler(async (req, res) => {
    const disputes = await Dispute.find()
        .populate("rental")
        .populate("raiser", "name email trustScore") // 🔥 Fetch trust scores too
        .populate("defendant", "name email trustScore")
        .sort("-createdAt");

    return res.status(200).json(new ApiResponse(200, disputes, "All disputes fetched"));
});

// 2. Resolve or Reject a Dispute (With Trust Score Logic)
const processDispute = asyncHandler(async (req, res) => {
    const { disputeId } = req.params;
    const { status, adminComment } = req.body;

    if (!['Resolved', 'Rejected'].includes(status)) {
        throw new ApiError(400, "Invalid status");
    }

    const dispute = await Dispute.findById(disputeId);
    if (!dispute) throw new ApiError(404, "Dispute not found");

    // Prevent double processing
    if (dispute.status !== 'Open') {
        throw new ApiError(400, "This dispute has already been processed.");
    }

    // 🔥 ACTION LOGIC: Update Trust Scores
    if (status === 'Resolved') {
        // CASE A: Dispute Accepted -> Renter is Guilty
        // Action: Deduct 10 points from Renter (Defendant)
        await User.findByIdAndUpdate(dispute.defendant, {
            $inc: { trustScore: -10 } 
        });
        console.log(`📉 Penalized Defendant (User ${dispute.defendant}) by 10 points.`);
    } 
    else if (status === 'Rejected') {
        // CASE B: Dispute Rejected -> Lender raised a bad claim
        // Action: Deduct 2 points from Lender (Raiser) to discourage spam
        await User.findByIdAndUpdate(dispute.raiser, {
            $inc: { trustScore: -2 } 
        });
        console.log(`📉 Penalized Raiser (User ${dispute.raiser}) by 2 points.`);
    }

    // Update Dispute Status
    dispute.status = status;
    dispute.adminComment = adminComment || "";
    await dispute.save();

    return res.status(200).json(new ApiResponse(200, dispute, `Dispute ${status} and Trust Scores updated`));
});

export { getAllDisputes, processDispute };