import { Router } from "express";
import { validateLogin, validateRegistration } from "../middlewares/auth";
import { loginUser, registerUser } from "../controllers/auth";

const router = Router();

router.post("/register", validateRegistration, registerUser);
router.post("/login", validateLogin, loginUser);

export default router;
