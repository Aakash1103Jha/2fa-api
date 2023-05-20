import { Router } from "express";
import { registerController, verifyRegisteredUserController } from "../controllers";
import { mailer } from "../middlewares";

const router = Router();

router.post("/register", registerController, mailer);
router.get("/verify", verifyRegisteredUserController);

export default router;

