import { Router } from "express";
import { 
    registerUser, 
    loginUser, 
    logoutUser, 
    googleLogin, 
    switchUserRole,
    getCurrentUser, 
    uploadIdentityProof,
    getUserProfile,
    toggleWishList,
    getWishlist,
    updateUserProfile // 🔥 1. Added Import
} from "../controllers/User.controller.js"

import { verifyJwt } from "../middlewares/Auth.middleware.js"; 
import { upload } from "../middlewares/multer.middleware.js"; 

const router = Router();

// Public Routes
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/google-login").post(googleLogin);
router.route("/profile/:userId").get(getUserProfile);

// Secured Routes
router.route("/logout").post(verifyJwt, logoutUser);
router.route("/switch-role").post(verifyJwt, switchUserRole);
router.route("/me").get(verifyJwt, getCurrentUser);

// 🔥 2. Added Route to update profile
router.route("/profile").patch(verifyJwt, updateUserProfile);

router.route("/upload-id").post(
    verifyJwt,                   
    upload.single("identityProof"), 
    uploadIdentityProof
);

// Wishlist Routes
router.route("/wishlist/toggle").post(verifyJwt, toggleWishList);
router.route("/wishlist").get(verifyJwt, getWishlist);

export default router;