import { Router } from "express";
import {
    updateStock
} from "../controller/stock.controller";

const router = Router();

router.put("/stock/update", updateStock);


export default router;