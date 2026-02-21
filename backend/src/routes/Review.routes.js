import { Router } from "express";
import { addReview, getProductReviews } from "../controllers/Review.controller.js";
import { verifyJwt } from "../middlewares/Auth.middleware.js";

const router = Router();

// Anyone can see the reviews for a product
router.route("/product/:productId").get(getProductReviews);

// Only logged-in users can submit a review
router.use(verifyJwt);
router.route("/add").post(addReview);

export default router;