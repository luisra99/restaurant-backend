import { Router } from "express";
import {
    listInventoryItems,
    getInventoryItemById,
    createInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
} from "../controller/inventoryItem.controller";

const router = Router();

router.get("/inventory-items", listInventoryItems);
router.get("/inventory-items/:id", getInventoryItemById);
router.post("/inventory-items", createInventoryItem);
router.put("/inventory-items/:id", updateInventoryItem);
router.delete("/inventory-items/:id", deleteInventoryItem);

export default router;