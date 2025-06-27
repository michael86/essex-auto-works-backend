import rateLimit from "express-rate-limit";

//auth limiter - to be used for all vital account routes
export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 minutes
  max: process.env.NODE_ENV === "development" ? 10000000 : 5, // 5 requests per window unless dev mode
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: "ERROR",
    code: "TOO_MANY_REQUESTS",
    message: "Too many requests from this IP, please try again later.",
  },
});

//generic route - generic routes
export const genericLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 1 hour
  max: 20, // 20 attempts per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: "ERROR",
    code: "TOO_MANY_LOGIN_ATTEMPTS",
    message: "Too many login attempts. Please wait 15 minutes.",
  },
});
