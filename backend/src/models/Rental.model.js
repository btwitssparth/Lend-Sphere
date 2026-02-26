import mongoose, { Schema } from "mongoose";

const rentalSchema = new Schema(
    {
        renter: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        // 🔥 NEW: Store the Renter's Address
        renterAddress: {
            type: String,
            required: true
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        },
        totalPrice: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["Pending", "Approved", "Active", "Completed", "Cancelled", "Rejected"],
            default: "Pending"
        },
        isReviewed: {
            type: Boolean,
            default: false
        },
        review: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    },
    { timestamps: true }
);

export const Rental = mongoose.model("Rental", rentalSchema);