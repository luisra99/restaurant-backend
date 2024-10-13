import { Router } from "express";
import {
  getUser,
  getUsers,
  editUser,
  createUser,
  deleteUser,
} from "../controller/admin.controller";

const router = Router();

router.get("/user", getUser);

router.get("/user/:id", getUsers);

router.post("/user", createUser);

router.put("/user/:id", editUser);

router.delete("/user/:id", deleteUser);

export default router;
