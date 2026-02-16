import { Router } from "express";
import { 
    addProduct, 
    getAllProducts, 
    getProductById, 
    updateProduct, 
    deleteProduct 
} from "../controllers/product.controller.js";
import { verifyJwt } from "../middlewares/Auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// Public Routes (Browsing)
router.route("/").get(getAllProducts); // Supports ?search=camera&category=Electronics
router.route("/:id").get(getProductById);

// Secured Routes (Management)
router.route("/add").post(
    verifyJwt, 
    upload.single("productImage"), 
    addProduct
);

router.route("/:id").patch(verifyJwt, upload.single("productImage"), updateProduct);
router.route("/:id").delete(verifyJwt, deleteProduct);

export default router;