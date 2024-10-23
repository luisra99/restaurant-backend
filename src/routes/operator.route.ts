import { Router } from "express";
import {
  setFinalCash,
  setInitialCash,
  setOperator,
} from "../controller/operator.controller";

const router = Router();

router.post("/operator/initialCash", setInitialCash);
router.post("/operator/finalCash", setFinalCash);
router.post("/operator", setOperator);

export default router;
