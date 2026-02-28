import { Router } from "express";
import { verifyJwt } from "../middlewares/Auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { createDispute, getMyDisputes, getDisputeByRental } from "../controllers/Dispute.controller.js";

const router = Router();

router.use(verifyJwt);

router.route("/create").post(upload.array("proofImages", 5), createDispute);
router.route("/my-disputes").get(getMyDisputes);
router.route("/rental/:rentalId").get(getDisputeByRental);

export default router;