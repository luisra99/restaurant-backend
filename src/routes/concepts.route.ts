import { Router } from "express";
import {
  createConcept,
  listConcepts,
  updateConcept,
  deleteConcept,
  findConceptsByFather,
  getConcept,
} from "../controller/concept.controller";

const router = Router();

router.post("/concepts", createConcept);
router.get("/concepts", listConcepts);
router.get("/concepts/:id", getConcept);
router.put("/concepts/:id", updateConcept);
router.delete("/concepts/:id", deleteConcept);
router.get("/concepts/father/:fatherId", findConceptsByFather);

export default router;
