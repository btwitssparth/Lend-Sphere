import { Router } from "express";
import { 
    registerUser, 
    loginUser, 
    logoutUser, 
    googleLogin, 
    switchUserRole, 

} from "../controllers/User.controller.js"
import { verifyJwt } from "../middlewares/Auth.middleware.js";

const router = Router();

// Public Routes
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/google-login").post(googleLogin);
//router.route("/forgot-password").post(forgotPassword);

// Secured Routes (Require Login)
router.route("/logout").post(verifyJwt, logoutUser);
router.route("/switch-role").post(verifyJwt, switchUserRole);

export default router;