import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asynchandler.js";

export const verifyAdmin = asyncHandler(async (req, res, next) => {
    // req.user is already set by verifyJWT
    if (!req.user || !req.user.roles?.admin) {
        throw new ApiError(403, "Access Denied: Admins only");
    }
    next();
});