import { Router } from "express";
import {
    listInventoryMovements,
    getInventoryMovementById,
    createInventoryMovement,
    updateInventoryMovement,
    deleteInventoryMovement,
} from "../controller/inventoryMovement.controller";

const router = Router();

router.get("/inventory-movements", listInventoryMovements);
router.get("/inventory-movements/:id", getInventoryMovementById);
router.post("/inventory-movements", createInventoryMovement);
router.put("/inventory-movements/:id", updateInventoryMovement);
router.delete("/inventory-movements/:id", deleteInventoryMovement);

export default router;