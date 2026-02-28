import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
        required: [true, 'Password is required'],
        minlength: 6,
    },
    
    // ✅ SIMPLIFIED: No file upload required. Just a default string.
    avatar: {
        type: String, 
        default: "https://cdn-icons-png.flaticon.com/512/149/149071.png" 
    },

    // ✅ ROLES (Including Admin)
    roles: {
        renting: { type: Boolean, default: true },
        lending: { type: Boolean, default: false },
        admin: { type: Boolean, default: false }
    },

    trustScore: { type: Number, default: 50, min: 0, max: 100 },
    isBlocked: { type: Boolean, default: false },
    refreshToken: { type: String },
    identityProof: { type: String, default: null },
    hasUploadedID: { type: Boolean, default: false },
    
    // ✅ WISHLIST
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }]

}, { timestamps: true });

// Encryption
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Password Check
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Access Token
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            name: this.name,
            roles: this.roles
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
};

// Refresh Token
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        { _id: this._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );
};

export const User = mongoose.model("User", userSchema);
export default User;