import { Router } from "express";
import { register, login, logout } from "../controllers/auth.controller";
import { listUserPermissions, listUserPermissionsByID, updateUserPermissions } from "../controllers/permisions.controller";

const router = Router();
router.get("/permissions", listUserPermissions)
router.get("/permissions/user/:id", listUserPermissionsByID)
router.put("/permissions/user/:id", updateUserPermissions)
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

export default router;
