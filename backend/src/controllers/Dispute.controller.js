import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Dispute } from "../models/Dispute.model.js";
import { Rental } from "../models/Rental.model.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import { sendEmail } from "../utils/sendEmail.js";

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

    // 📧 EMAIL TRIGGER: Notify Renter about the reported issue with Evidence
    try {
        // Populate the renter details specifically for the email
        await rental.populate('renter', 'name email');

        if (rental.renter && rental.renter.email) {
            // Dynamically format the uploaded evidence images into HTML tags
            const evidenceImagesHtml = proofImages && proofImages.length > 0 
                ? proofImages.map(imgUrl => `<img src="${imgUrl}" alt="Evidence" style="width: 100%; max-width: 400px; height: auto; border-radius: 8px; margin-bottom: 12px; border: 1px solid #e2e8f0; display: block;" />`).join('')
                : '<p style="color: #6b7280; font-style: italic;">No images were attached.</p>';

            const disputeEmailHtml = `
                <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 16px; background-color: #ffffff;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <span style="background-color: #fee2e2; color: #dc2626; padding: 8px 16px; border-radius: 9999px; font-weight: bold; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Issue Reported</span>
                    </div>
                    
                    <h2 style="color: #111827; margin-bottom: 20px; text-align: center;">Action Required: Damage/Issue Reported</h2>
                    
                    <p style="color: #374151; font-size: 16px; line-height: 1.5;">
                        Hi <strong>${rental.renter.name.split(' ')[0]}</strong>, the lender of <strong>${rental.product.name}</strong> has reported an issue regarding your recent rental.
                    </p>
                    
                    <div style="background-color: #f8fafc; padding: 20px; border-radius: 12px; margin: 24px 0; border: 1px solid #e2e8f0;">
                        <h3 style="margin-top: 0; color: #0f172a; font-size: 16px; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">Issue Details</h3>
                        <p style="margin: 15px 0 10px 0; font-size: 15px; color: #334155; line-height: 1.5;">
                            <strong>Reason:</strong> ${reason}<br/><br/>
                            <strong>Description:</strong><br/>${description}
                        </p>
                        <p style="margin: 0 0 10px 0; font-size: 15px; color: #334155;"><strong>Claim Amount Requested:</strong> ₹${claimAmount}</p>
                    </div>

                    <div style="margin: 24px 0;">
                        <h3 style="color: #0f172a; font-size: 16px; margin-bottom: 15px;">Provided Evidence:</h3>
                        ${evidenceImagesHtml}
                    </div>

                    <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 0 8px 8px 0; margin-top: 24px;">
                        <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.5;">
                            <strong>Next Steps:</strong> Please log in to your Lend-Sphere Resolution Center immediately to review this claim and respond. If no action is taken, the claim amount may be automatically deducted from your security deposit.
                        </p>
                    </div>
                </div>
            `;

            // Fire and forget email
            sendEmail({
                email: rental.renter.email, 
                subject: `⚠️ Important: Issue Reported for ${rental.product.name}`,
                html: disputeEmailHtml
            });
        }
    } catch (emailError) {
        console.error("Failed to send dispute email:", emailError);
    }

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

const getDisputesAgainstMe = asyncHandler(async (req, res) => {
    const disputes = await Dispute.find({ defendant: req.user._id })
        .populate("rental")
        .populate("raiser", "name email")
        .sort("-createdAt");
    
    return res.status(200).json(new ApiResponse(200, disputes, "Disputes against me fetched"));
});

// 🔥 NEW: Submit Counter-Response (The Defense)
const submitResponse = asyncHandler(async (req, res) => {
    const { disputeId } = req.params;
    const { comment } = req.body;

    const dispute = await Dispute.findById(disputeId);
    if (!dispute) throw new ApiError(404, "Dispute not found");

    // Check if user is the defendant
    if (dispute.defendant.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not the defendant in this case");
    }

    if (dispute.status !== 'Open') {
        throw new ApiError(400, "Cannot respond to a closed dispute");
    }

    if (dispute.isResponseSubmitted) {
        throw new ApiError(400, "You have already submitted a response");
    }

    // Handle Optional Proof Images (if any)
    let proofUrls = [];
    if (req.files && req.files.length > 0) {
        const uploadPromises = req.files.map(file => uploadOnCloudinary(file.path));
        const uploadedImages = await Promise.all(uploadPromises);
        proofUrls = uploadedImages.filter(img => img !== null).map(img => img.url);
    }

    dispute.defendantComment = comment;
    dispute.defendantProof = proofUrls;
    dispute.isResponseSubmitted = true;
    
    // Optionally change status to "Under Review" to alert Admin
    dispute.status = "Under Review";

    await dispute.save();

    return res.status(200).json(new ApiResponse(200, dispute, "Response submitted successfully"));
});

export { createDispute, getMyDisputes, getDisputeByRental, getDisputesAgainstMe, submitResponse };