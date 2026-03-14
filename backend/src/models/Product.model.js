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
    category: {
        type: String,
        required: true
    },
    // 🔥 NEW: Quantity Field (Inventory)
    quantity: {
        type: Number,
        required: true,
        default: 1, 
        min: 1
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
    // 🔥 NEW: Geospatial data for Map Feature
    geoLocation: {
        type: {
            type: String,
            enum: ['Point'], 
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [Longitude, Latitude]
            default: [0, 0]
        }
    }
}, {
    timestamps: true
});

// Index for map searches
productSchema.index({ geoLocation: "2dsphere" });

export const Product = mongoose.model("Product", productSchema);