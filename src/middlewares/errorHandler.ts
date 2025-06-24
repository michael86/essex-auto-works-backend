import { Request, Response, NextFunction } from "express";

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error("Error:", err);

  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  const code = err.code || "SERVER_ERROR";

  res.status(status).json({
    status: 0,
    message,
    code,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
}
