import { Router } from "express";
import {
  openAccount,
  listConcepts,
  updateConcept,
  deleteConcept,
  findConceptsByFather,
  getConcept,
} from "../controller/account.controller";

const router = Router();

router.post("/accounts", openAccount);

export default router;
