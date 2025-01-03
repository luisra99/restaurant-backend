import { Router } from "express";
import { printAreas, printRecipe } from "../controller/printer.controller";
import { operatorInform } from "../controller/statistics.controller";

const router = Router();

router.post("/printer/account/:id", printRecipe);
router.post("/printer/register", printRecipe);
router.get("/printer/today", printAreas);
router.get("/printer/inform", operatorInform);

export default router;
