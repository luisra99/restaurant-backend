import { Router } from "express";
import {
    listUnitOfMeasures,
    getUnitOfMeasureById,
    createUnitOfMeasure,
    updateUnitOfMeasure,
    deleteUnitOfMeasure,
} from "../controller/unitOfMeasure.controller";

const router = Router();

router.get("/unit-of-measures", listUnitOfMeasures);
router.get("/unit-of-measures/:id", getUnitOfMeasureById);
router.post("/unit-of-measures", createUnitOfMeasure);
router.put("/unit-of-measures/:id", updateUnitOfMeasure);
router.delete("/unit-of-measures/:id", deleteUnitOfMeasure);

export default router;