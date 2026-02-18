import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,

    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        minlength: 6,
        select: false,
    },

    roles: {
        renting: {
            type: Boolean,
            default: true,
        },
        lending: {
            type: Boolean,
            default: false,
        },
    },

    trustScore: {
        type: Number,
        default: 50,
        min: 0,
        max: 100,
    },

    isBlocked: {
        type: Boolean,
        default: false,
    },
    refreshToken: {
        type: String,
        select: false,
    },
    identityProof:{
        type: String,
        default: null,
    },
    hasUploadedID:{
        type: Boolean,
        default: false,
    }

},
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;