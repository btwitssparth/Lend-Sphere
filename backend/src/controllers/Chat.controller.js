import { GoogleGenerativeAI } from "@google/generative-ai";
import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ===== SYSTEM PROMPT =====
const SYSTEM_INSTRUCTION = `
You are the friendly and helpful AI Support Assistant for "LendSphere", a peer-to-peer rental marketplace.

Your goal is to help users rent items, list their gear, and understand the platform.

Key Platform Rules & Features:

1. Renting:
Users browse items, select dates on a calendar, and click "Request to Rent".
The lender must approve before the booking is confirmed.

2. Payments:
We use secure Stripe payments.
Money is held in escrow until the rental is approved.

3. Safety:
All users must upload a Government ID before renting.
Verified users receive a badge.

4. Location:
Users can search for gear within a specific radius (2km, 5km, etc.) using GPS.

5. Lenders:
Lenders can list items with photos, set daily prices, and manage requests in their dashboard.

Tone:
Professional, kind, concise.
Do not answer questions unrelated to LendSphere.
If unsure, ask them to email support@lendsphere.com.
`;

// ===== MODEL FALLBACK LIST =====
const DEFAULT_GEMINI_MODELS = [
    "gemini-2.5-flash"
];

// Allows override from .env
const getCandidateModels = () => {
    const configuredModels = (process.env.GEMINI_MODEL || "")
        .split(",")
        .map((model) => model.trim())
        .filter(Boolean);

    return [...configuredModels, ...DEFAULT_GEMINI_MODELS];
};

// ===== CONTROLLER =====
const askGemini = asyncHandler(async (req, res) => {
    const { message } = req.body;

    if (!message) {
        throw new ApiError(400, "Message is required");
    }

    if (!process.env.GEMINI_API_KEY) {
        throw new ApiError(500, "GEMINI_API_KEY is not configured");
    }

    const candidateModels = getCandidateModels();
    let lastError = null;

    for (const modelName of candidateModels) {
        try {
            const model = genAI.getGenerativeModel({
                model: modelName,
                systemInstruction: SYSTEM_INSTRUCTION
            });

            const result = await model.generateContent(message);
            const text = result.response.text();

            return res.status(200).json(
                new ApiResponse(
                    200,
                    {
                        reply: text,
                        model: modelName
                    },
                    "Success"
                )
            );

        } catch (error) {
            lastError = error;

            // If model not found, try next one
            if (error?.status === 404) {
                console.warn(`Model not found: ${modelName}. Trying next...`);
                continue;
            }

            console.error(`Gemini error with model ${modelName}:`, error);
            break;
        }
    }

    console.error("All Gemini models failed:", lastError);

    throw new ApiError(
        500,
        "Failed to get response from AI. Please verify API key and model access."
    
    )
});

export { askGemini };