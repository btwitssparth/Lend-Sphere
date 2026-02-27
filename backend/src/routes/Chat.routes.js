import { Router } from "express";
import { askGemini } from "../controllers/Chat.controller.js";

const router = Router();

router.route("/ask").post(askGemini);

export default router;