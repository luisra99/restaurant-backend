import { Router } from "express";
import { printAreas, printRecip } from "../controller/printer.controller";

const router = Router();

router.post("/printer/account/:id", printRecip);
router.post("/printer/register", printRecip);
router.get("/printer/today", printAreas);

export default router;
