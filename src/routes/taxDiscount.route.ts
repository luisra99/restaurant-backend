import express from "express";
import {
  listTaxDiscounts,
  getTaxDiscountById,
  createTaxDiscount,
  updateTaxDiscount,
  deleteTaxDiscount,
  alterTaxDiscount,
} from "../controller/taxDiscount.controller";

const router = express.Router();

// Listar todos los TaxDiscounts
router.get("/taxDiscounts", listTaxDiscounts);

// Obtener un TaxDiscount por su ID
router.get("/taxDiscounts/:id", getTaxDiscountById);

// Crear un nuevo TaxDiscount
router.post("/taxDiscounts", createTaxDiscount);

// Alternar estado TaxDiscount
router.post("/taxDiscounts/alterState/:id", alterTaxDiscount);

// Actualizar un TaxDiscount
router.put("/taxDiscounts/:id", updateTaxDiscount);

// Eliminar un TaxDiscount
router.delete("/taxDiscounts/:id", deleteTaxDiscount);

export default router;
