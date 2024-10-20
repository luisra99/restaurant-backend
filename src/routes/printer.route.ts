import { Router } from "express";
import {
printRecip
} from "../controller/printer.controller";

const router = Router();

router.post("/printer/account/:id", printRecip);
router.post("/printer/register", printRecip);
router.post("/printer/today", printRecip);

export default router;
