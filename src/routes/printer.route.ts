import { Router } from "express";
import { printAreas, printRecip } from "../controller/printer.controller";
import { operatorInform } from "../controller/statistics.controller";

const router = Router();

router.post("/printer/account/:id", printRecip);
router.post("/printer/register", printRecip);
router.get("/printer/today", printAreas);
router.get("/printer/inform", operatorInform);

export default router;
