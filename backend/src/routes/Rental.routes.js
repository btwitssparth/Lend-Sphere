import { Router } from "express";
import { 
    rentItem, 
    getMyRentals, 
    getLenderRentals, 
    updateRentalStatus, 
    getUnavailableDates 
} from "../controllers/Rental.controller.js";
import { verifyJwt } from "../middlewares/Auth.middleware.js"; // Note: verifyJWT is usually uppercase based on your other files!

const router = Router();

// ==========================================
// PUBLIC ROUTES (No login required)
// ==========================================

// Anyone can view the calendar dates for a product
router.route("/unavailable-dates/:productId").get(getUnavailableDates);


// ==========================================
// SECURE ROUTES (Login required)
// ==========================================
router.use(verifyJwt); // Everything below this line is locked!

// Renter Routes
router.route("/rent").post(rentItem);          // Changed from /request to match frontend
router.route("/my-rentals").get(getMyRentals);

// Lender Routes
router.route("/lender-requests").get(getLenderRentals); // Changed from /lender/requests to match frontend
router.route("/status").patch(updateRentalStatus);      // Changed from .post("/lender/update-status") to .patch("/status")

export default router;