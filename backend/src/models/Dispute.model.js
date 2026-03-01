import mongoose, { Schema } from "mongoose";

const disputeSchema = new Schema(
    {
        rental: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Rental",
            required: true
        },
        raiser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        defendant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        reason: {
            type: String,
            required: true,
            enum: ["Damage", "Late Return", "Item Missing", "Other"]
        },
        description: {
            type: String,
            required: true
        },
        proofImages: [{
            type: String, 
            required: true
        }],
        claimAmount: {
            type: Number,
            required: true,
            min: 0
        },
        status: {
            type: String,
            enum: ["Open", "Under Review", "Resolved", "Rejected"],
            default: "Open"
        },
        
        // 🔥 NEW: DEFENDANT'S RESPONSE (The Appeal)
        defendantComment: {
            type: String,
            default: ""
        },
        defendantProof: [{
            type: String // Optional URLs for their proof
        }],
        isResponseSubmitted: {
            type: Boolean,
            default: false
        },

        adminComment: {
            type: String
        }
    },
    { timestamps: true }
);

export const Dispute = mongoose.model("Dispute", disputeSchema);