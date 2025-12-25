import { Response } from "express";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}

export const success = <T>(
  res: Response,
  data: T,
  statusCode = 200
): Response => {
  return res.status(statusCode).json({
    success: true,
    data,
  });
};

export const paginated = <T>(
  res: Response,
  data: T[],
  total: number,
  page?: number,
  limit?: number
): Response => {
  return res.status(200).json({
    success: true,
    data,
    meta: { total, page, limit },
  });
};

export const error = (
  res: Response,
  message: string,
  statusCode = 500,
  code?: string,
  details?: any
): Response => {
  return res.status(statusCode).json({
    success: false,
    error: message,
    code,
    details,
  });
};
