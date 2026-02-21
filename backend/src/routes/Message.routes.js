import { Router } from "express";
import {sendMessages, getMessages } from "../controllers/Message.controller.js";
import { verifyJwt } from "../middlewares/Auth.middleware.js";

const router = Router();

// All message routes require authentication
router.use(verifyJwt);

router.route("/send").post(sendMessages);
router.route("/:rentalId").get(getMessages);

export default router;