import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(helmet()); // security headers
app.use(morgan("dev")); // logs requests
app.use(express.json()); // parses JSON body
app.use(cookieParser()); // parses cookies

app.listen(PORT, () => console.log("Server running on port", PORT));
