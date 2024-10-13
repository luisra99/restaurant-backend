import { Router } from "express";
import { authMiddleware } from "../middlewares/middlewares";
import { nomeclator } from "../controller/nomenclator.controller";

const router = Router();

router.get("/:model", authMiddleware, nomeclator);

export default router;
