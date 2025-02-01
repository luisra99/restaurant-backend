import { Router } from "express";
import { listUsers, deleteUser, updateUser } from "../controller/users.controller";

const router = Router();

router.get("/users/list", listUsers);
router.delete("/user/:id", deleteUser);
router.get("/user/:id", listUsers);
router.put("/user/:id", updateUser);


export default router;
