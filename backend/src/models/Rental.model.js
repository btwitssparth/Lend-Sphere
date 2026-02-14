import mongoose, { Schema } from "mongoose";

const rentalSchema = new Schema(
    {
        renter: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
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
            enum: ["Pending", "Approved", "Active", "Completed", "Cancelled"],
            default: "Pending"
        }

    },
    { timestamps: true }
);

export const Rental = mongoose.model("Rental",rentalSchema);
