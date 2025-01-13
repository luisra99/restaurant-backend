import { Router } from "express";
import {
    listInventoryItems,
    getInventoryItemById,
    createInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
} from "../controller/inventoryItem.controller";
import { getStockByLocal } from "../controller/inventoryReports.controller";

const router = Router();

router.get("/inventory-items", listInventoryItems);
router.get("/inventory-items/:id", getInventoryItemById);
router.post("/inventory-items", createInventoryItem);
router.put("/inventory-items/:id", updateInventoryItem);
router.delete("/inventory-items/:id", deleteInventoryItem);
router.get("/inventory/local", getStockByLocal);

export default router;