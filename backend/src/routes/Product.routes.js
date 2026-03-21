import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/Auth.middleware.js";
import {
    addProduct, // 🔥 FIXED: Changed from createProduct to match your controller
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getMyListings
} from "../controllers/product.controller.js";

const router = Router();

// Public Routes (Anyone can view products)
router.route("/").get(getAllProducts);
router.route("/:id").get(getProductById);

// Protected Routes (Must be logged in)
router.use(verifyJwt);

router.route("/my-listings").get(getMyListings);

// 🔥 FIXED: Now routing to addProduct
router.route("/")
    .post(upload.fields([
        { name: "productImage", maxCount: 1 },
        { name: "productImages", maxCount: 4 }
    ]), addProduct);

router.route("/:id")
    .put(upload.fields([
        { name: "productImage", maxCount: 1 },
        { name: "productImages", maxCount: 4 }
    ]), updateProduct)
    .delete(deleteProduct);

export default router;