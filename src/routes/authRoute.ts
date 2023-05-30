import { Router } from "express";
import { loginController, registerController, validateController, verifyRegisteredUserController } from "../controllers";
import { mailer, validateToken } from "../middlewares";

const router = Router();

router.post("/register", registerController, mailer);
router.get("/verify", verifyRegisteredUserController);
router.post("/login", loginController);
router.get("/validate", validateToken, validateController);

export default router;

