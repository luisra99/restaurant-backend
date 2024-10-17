import { Router } from "express";
import {
  openAccount,
  listAccounts,
  updateConcept,
  deleteConcept,
  findConceptsByFather,
  getConcept,
  getAccount,
  modifyAccountDetails,
  deleteAccountDetails,
} from "../controller/account.controller";

const router = Router();

router.post("/accounts", openAccount);
router.put("/accounts/details", modifyAccountDetails);
router.delete("/accounts/details/:idAccount/:idOffer", deleteAccountDetails);
router.get("/accounts", listAccounts);
router.get("/accounts/:id", getAccount);

export default router;
