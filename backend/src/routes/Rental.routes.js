import {Router} from "express";
import { rentItem,getMyRentals,getLenderRentals,updateRentalStatus,getUnavailableDates } from "../controllers/Rental.controller.js";
import { verifyJwt } from "../middlewares/Auth.middleware.js";

const router = Router();

// secured Routes

// Renter Routes
router.use(verifyJwt);
router.route("/request").post(rentItem)
router.route("/my-rentals").get(getMyRentals)
router.route("/unavailable-dates/:productId").get(getUnavailableDates)

//Lender Routes
router.route("/lender/requests").get(getLenderRentals);
router.route("/lender/update-status").post(updateRentalStatus);
export default router
