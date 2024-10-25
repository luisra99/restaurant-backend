import { Router } from "express";
import {
  getInitialCash,
  setFinalCash,
  setInitialCash,
  setOperator,
} from "../controller/operator.controller";
import { setPropina } from "../controller/incomes.controller";

const router = Router();

router.post("/operator/initialCash", setInitialCash);
router.get("/operator/initialCash", getInitialCash);
router.post("/operator/finalCash", setFinalCash);
router.post("/operator/savePropina", setPropina);
router.post("/operator", setOperator);

export default router;
