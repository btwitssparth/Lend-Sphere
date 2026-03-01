import { Router } from "express";
import { verifyJwt } from "../middlewares/Auth.middleware.js";
import { verifyAdmin } from "../middlewares/Admin.middleware.js";
import { getAllDisputes, processDispute } from "../controllers/Admin.controller.js";

const router = Router();

router.use(verifyJwt, verifyAdmin);

// Get ALL disputes (Plural makes sense here)
router.route("/disputes").get(getAllDisputes);

// Process ONE dispute (Change this to SINGULAR to match frontend)
router.route("/dispute/:disputeId/process").post(processDispute); 
// ^^^ CHANGED FROM "/disputes/..." TO "/dispute/..."

export default router;