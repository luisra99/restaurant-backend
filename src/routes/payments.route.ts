import { Router } from "express";
import {
  pay,
  getPayments,
  deletePayments,
} from "../controller/payments.controller";

const router = Router();

// Endpoint para registrar un nuevo pago
router.post("/payments", pay);

// Endpoint para obtener todos los pagos de una cuenta específica
router.get("/accounts/:accountId/payments", getPayments);

// Endpoint para descartar (eliminar) todos los pagos de una cuenta
router.delete("/accounts/:accountId/payments", deletePayments);

export default router;
