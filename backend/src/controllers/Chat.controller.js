import { GoogleGenerativeAI } from "@google/generative-ai";
import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const askGemini = asyncHandler(async (req, res) => {
    const { message } = req.body;

    if (!message) {
        throw new ApiError(400, "Message is required");
    }

    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
        });

        const result = await model.generateContent(message);
        const text = result.response.text();

        return res
            .status(200)
            .json(new ApiResponse(200, { reply: text }, "Success"));

    } catch (error) {
        console.error("Gemini API Error:", error);
        throw new ApiError(500, "Failed to get response from AI");
    }
});

export { askGemini };