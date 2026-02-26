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
    // 🔥 NEW: Geospatial data for 5km map search
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

// 🔥 Tell MongoDB to map this field on a 2D sphere (the Earth)
productSchema.index({ geoLocation: "2dsphere" });

export const Product = mongoose.model("Product", productSchema);