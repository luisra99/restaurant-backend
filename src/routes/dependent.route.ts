import express from "express";
import {
  listDependents,
  getDependentById,
  createDependent,
  updateDependent,
  deleteDependent,
} from "../controller/dependent.controller";

const router = express.Router();

// Listar todos los dependientes
router.get("/dependents", listDependents);

// Obtener un dependiente por su ID
router.get("/dependents/:id", getDependentById);

// Crear un nuevo dependiente
router.post("/dependents", createDependent);

// Actualizar un dependiente
router.put("/dependents/:id", updateDependent);

// Eliminar un dependiente
router.delete("/dependents/:id", deleteDependent);

export default router;
