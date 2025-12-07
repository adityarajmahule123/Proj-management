import { User } from "../models/user.models.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import jwt from "jsonwebtoken";
export const verifyJWT = asyncHandler(async (req, res, next) => {
  const authHeader = req.header("Authorization") || req.headers.authorization;
  const bearerMatch = authHeader && authHeader.match(/^Bearer\s+(.+)$/i);
  const token =
    req.cookies?.accessToken || (bearerMatch ? bearerMatch[1] : null);
  if (process.env.NODE_ENV !== "production") {
    // Helpful debug when testing locally (Postman)
    console.debug("verifyJWT: authHeader=", authHeader);
    console.debug("verifyJWT: token present=", !!token);
  }
  if (!token) {
    return next(new ApiError("Unauthorized", 401));
  }
  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken -emailVerificationToken -emailVerificationExpiry" // Excluding sensitive fields
    );
    if (!user) {
      return next(new ApiError("Invalid access token", 401));
    }
    req.user = user;
    next();
  } catch (error) {
    return next(new ApiError("Invalid access token", 401));
  }
});
