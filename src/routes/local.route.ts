import { Router } from "express";
import {
    listLocals,
    getLocalById,
    createLocal,
    updateLocal,
    deleteLocal,
    getLocalAreasById,
} from "../controller/local.controller";

const router = Router();

router.get("/locals", listLocals);
router.get("/locals/:id", getLocalById);
router.get("/locals/:id/areas", getLocalAreasById);
router.post("/locals", createLocal);
router.put("/locals/:id", updateLocal);
router.delete("/locals/:id", deleteLocal);

export default router;