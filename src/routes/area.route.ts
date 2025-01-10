import { Router } from "express";
import {
    listAreas,
    getAreaById,
    createArea,
    updateArea,
    deleteArea,
} from "../controller/area.controller";

const router = Router();

router.get("/areas", listAreas);
router.get("/areas/:id", getAreaById);
router.post("/areas", createArea);
router.put("/areas/:id", updateArea);
router.delete("/areas/:id", deleteArea);

export default router;