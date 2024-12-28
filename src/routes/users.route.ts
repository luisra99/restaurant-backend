import { Router } from "express";
import { listUsers } from "../controller/users.controller";

const router = Router();

router.get("/users/list", listUsers);

export default router;
