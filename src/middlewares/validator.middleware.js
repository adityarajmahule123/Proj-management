import { validationResult } from "express-validator";
import { ApiError } from "../utils/api-error.js";

export const validate = (req, res, next) => {
  const errors = validationResult(req); // "errors" is an array
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = []; // defining empty array to extract all errors into it from the old array "errors"
  errors.array().map(
    // .array is done to make sure it is an array
    (err) =>
      extractedErrors.push({
        [err.path]: err.msg,
      })
  );
  throw new ApiError(422, "Received data is not valid", extractedErrors);
};
