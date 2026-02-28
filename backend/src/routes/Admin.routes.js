import { Router } from "express";
import { verifyJwt } from "../middlewares/Auth.middleware.js";
import { verifyAdmin } from "../middlewares/Admin.middleware.js";
import { getAllDisputes, processDispute } from "../controllers/Admin.controller.js";

const router = Router();

router.use(verifyJwt, verifyAdmin);

router.route("/disputes").get(getAllDisputes);
router.route("/dispute/:disputeId/process").post(processDispute);

export default router;