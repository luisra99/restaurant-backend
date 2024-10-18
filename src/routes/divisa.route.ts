import express from "express";
import {
  listDivisas,
  getDivisaById,
  createDivisa,
  updateDivisa,
  deleteDivisa,
} from "../controller/divisa.controller";

const router = express.Router();

// Listar todas las divisas
router.get("/divisas", listDivisas);

// Obtener una divisa específica por ID
router.get("/divisas/:id", getDivisaById);

// Crear una nueva divisa
router.post("/divisas", createDivisa);

// Actualizar una divisa existente
router.put("/divisas/:id", updateDivisa);

// Eliminar una divisa
router.delete("/divisas/:id", deleteDivisa);

export default router;
