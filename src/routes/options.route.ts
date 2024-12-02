import { Router } from "express";
import { getOptions } from "../controller/options.controller";

const router = Router();
router.get("/options/:concept", getOptions);

export default router;
