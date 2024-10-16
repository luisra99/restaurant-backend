import { Router } from "express";
import {
  openAccount,
  listAccounts,
  updateConcept,
  deleteConcept,
  findConceptsByFather,
  getConcept,
  getAccount,
} from "../controller/account.controller";

const router = Router();

router.post("/accounts", openAccount);
router.get("/accounts", listAccounts);
router.get("/accounts/:id", getAccount);

export default router;
