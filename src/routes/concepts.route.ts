import { Router } from "express";
import {
  createConcept,
  updateConcept,
  deleteConcept,
  getConcepts,
  getConceptById,
} from "../controller/concept.controller";

const router = Router();

router.post("/concept/:fatherDenomination", createConcept);
router.get("/concept-list/:fatherDenomination", getConcepts);
router.get("/concept/:id", getConceptById);
router.put("/concept/:id", updateConcept);
router.delete("/concept/:id", deleteConcept);

export default router;
