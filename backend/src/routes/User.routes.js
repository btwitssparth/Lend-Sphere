import { Router } from "express";
import { 
    registerUser, 
    loginUser, 
    logoutUser, 
    googleLogin, 
    switchUserRole,
    getCurrentUser, 
    uploadIdentityProof // <--- 1. Ensure this is imported
} from "../controllers/User.controller.js"

// <--- 2. FIX IMPORT NAME (verifyJwt)
import { verifyJwt } from "../middlewares/Auth.middleware.js"; 

// <--- 3. ADD MISSING UPLOAD IMPORT
import { upload } from "../middlewares/multer.middleware.js"; 

const router = Router();

// Public Routes
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/google-login").post(googleLogin);

// Secured Routes
router.route("/logout").post(verifyJwt, logoutUser);
router.route("/switch-role").post(verifyJwt, switchUserRole);
router.route("/me").get(verifyJwt, getCurrentUser);

// <--- 4. FIX ROUTE DEFINITION
router.route("/upload-id").post(
    verifyJwt,                   // Use 'verifyJwt' (matching the import above)
    upload.single("identityProof"), // 'upload' is now defined
    uploadIdentityProof
);

export default router;