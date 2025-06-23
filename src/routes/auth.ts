import { Router } from "express";
import { validateRegistration } from "../middlewares/auth";
import { registerUser } from "../controllers/auth";

const router = Router();

router.post("/register", validateRegistration, registerUser);

export default router;
