import { User } from "../models/user.models.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import jwt from "jsonwebtoken";
export const verifyJWT = asyncHandler(async (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token =
    req.cookies?.accessToken ||
    (authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null);
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
    throw new ApiError("Invalid access token", 401);
  }
});
