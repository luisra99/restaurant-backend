import { Router } from "express";
import {
  openAccount,
  listAccounts,
  getAccount,
  modifyAccountDetails,
  deleteAccountDetails,
  modifyAccount,
  deleteAccount,
  closeAccount,
  deleteTax,
  addTax,
} from "../controller/account.controller";

const router = Router();

router.post("/accounts", openAccount);
router.put("/accounts/details", modifyAccountDetails);
router.put("/accounts/:id", modifyAccount);
router.delete("/accounts/details/:idAccount/:idOffer", deleteAccountDetails);
router.get("/accounts", listAccounts);
router.get("/accounts/:id", getAccount);
router.delete("/accounts/close/:id", closeAccount);
router.delete("/accounts/:id", deleteAccount);
router.delete("/accounts/tax/:id", deleteTax);
router.post("/accounts/tax/:id", addTax);

export default router;
