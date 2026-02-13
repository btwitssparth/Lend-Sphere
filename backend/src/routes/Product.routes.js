import { Router } from "express";
import { addProduct, getAllProducts } from "../controllers/product.controller.js";
import { verifyJwt } from "../middlewares/Auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// Public Route (Anyone can view)
router.route("/").get(getAllProducts);

// Secured Route (Only logged in users can add)
router.route("/add").post(
    verifyJwt, 
    upload.single("productImage"), // Expecting a field named 'productImage'
    addProduct
);

export default router;