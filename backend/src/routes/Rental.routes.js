import {Router} from "express";
import { rentItem,getMyRentals } from "../controllers/Rental.controller.js";
import { verifyJwt } from "../middlewares/Auth.middleware.js";

const router = Router();

// secured Routes

router.use(verifyJwt);
router.route("/request").post(rentItem)
router.route("/my-rentals").get(getMyRentals)

export default router
