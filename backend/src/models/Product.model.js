import mongoose, { Schema } from 'mongoose';

const productSchema = new Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
    },
    productImages:[ {
        type: String,
        required: true,
    }],
    pricePerDay: {
        type: Number,
        required: true,
        min: 0
    },
    location: {
        type: String,
        required: true,
    },
    isAvailable: {
        type: Boolean,
        default: true
    },

},
    {
        timestamps: true
    }
);

export const Product = mongoose.model("Product",productSchema);