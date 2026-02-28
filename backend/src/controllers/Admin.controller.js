import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Dispute } from "../models/Dispute.model.js";

// 1. Get ALL Disputes
const getAllDisputes = asyncHandler(async (req, res) => {
    const disputes = await Dispute.find()
        .populate("rental")
        .populate("raiser", "name email")
        .populate("defendant", "name email")
        .sort("-createdAt");

    return res.status(200).json(new ApiResponse(200, disputes, "All disputes fetched"));
});

// 2. Resolve or Reject a Dispute
const processDispute = asyncHandler(async (req, res) => {
    const { disputeId } = req.params;
    const { status, adminComment } = req.body;

    if (!['Resolved', 'Rejected'].includes(status)) {
        throw new ApiError(400, "Invalid status. Must be 'Resolved' or 'Rejected'");
    }

    const dispute = await Dispute.findById(disputeId);
    if (!dispute) throw new ApiError(404, "Dispute not found");

    dispute.status = status;
    dispute.adminComment = adminComment || "";
    await dispute.save();

    return res.status(200).json(new ApiResponse(200, dispute, `Dispute marked as ${status}`));
});

export { getAllDisputes, processDispute };