import { Router } from "express";
import { register, login, confirmEmail } from "../controller/auth.controller";
import { validateSchema } from "../middlewares/validator.middleware";
import { loginSchema } from "../Schema/auth.schema";
const router = Router();

router.post("/register", register);

router.get("/confirm/:token", confirmEmail);

router.post("/login", validateSchema(loginSchema), login);

export default router;
