import { Response } from "express";
import { ApiResponse } from "../types/express";

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  body: ApiResponse<T>
) => {
  return res.status(statusCode).json(body);
};
