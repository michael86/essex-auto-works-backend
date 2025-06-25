import { Router } from "express";
import { validateLogin, validateRegistration } from "../middlewares/auth";
import { loginUser, registerUser, verifyEmail } from "../controllers/auth";

const router = Router();

router.post("/register", validateRegistration, registerUser);
router.post("/login", validateLogin, loginUser);
router.get("/verify-email/:token", verifyEmail);

export default router;
