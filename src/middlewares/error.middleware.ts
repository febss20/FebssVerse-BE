import { Request, Response, NextFunction } from "express";
import { AppError, ValidationError } from "../errors/index.js";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { logger } from "../utils/logger.util.js";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // AppError
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
      code: err.code,
      ...(err instanceof ValidationError &&
        err.details && { details: err.details }),
    });
  }

  // Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      error: "Validation failed",
      code: "VALIDATION_ERROR",
      details: err.errors.map((e) => ({
        path: e.path.join("."),
        message: e.message,
      })),
    });
  }

  // Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002":
        return res.status(409).json({
          success: false,
          error: "Resource already exists",
          code: "CONFLICT",
        });
      case "P2025":
        return res.status(404).json({
          success: false,
          error: "Resource not found",
          code: "NOT_FOUND",
        });
      default:
        break;
    }
  }

  // Unknown errors
  const isProduction = process.env.NODE_ENV === "production";
  return res.status(500).json({
    success: false,
    error: isProduction ? "Internal server error" : err.message,
    code: "INTERNAL_ERROR",
    ...(!isProduction && { stack: err.stack }),
  });
};
