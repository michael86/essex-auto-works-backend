//load env variables
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

//Routes
import authRoutes from "./src/routes/auth";
import { authLimiter } from "./src/middlewares/rateLimit";
import { errorHandler } from "./src/middlewares/errorHandler";

const PORT = process.env.PORT || 3000;
const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(helmet()); // security headers
app.use(morgan("dev")); // logs requests
app.use(express.json()); // parses JSON body
app.use(cookieParser()); // parses cookies

// Routes
app.use("/auth", authLimiter, authRoutes);

//error handler
app.use(errorHandler);

app.listen(PORT, () => console.log("Server running on port", PORT));
