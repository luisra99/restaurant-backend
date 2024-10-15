import { Router } from "express";
import {
  createTable,
  listTables,
  updateTable,
  deleteTable,
  getTable,
} from "../controller/table.controller";

const router = Router();

// Ruta para crear una nueva mesa
router.post("/tables", createTable);

// Ruta para listar todas las mesas
router.get("/tables", listTables);

// Ruta para obtener una mesa
router.get("/tables/:id", getTable);

// Ruta para modificar una mesa
router.put("/tables/:id", updateTable);

// Ruta para eliminar una mesa
router.delete("/tables/:id", deleteTable);

export default router;
