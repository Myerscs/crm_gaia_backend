import { Router } from "express";
import { registrarse, login, me, changePass } from "../controladores/auth.controller.js";
import { getUsers, updateIaActiva, renovarTokens, addTokens, removeTokens } from "../controladores/userAdminController.js";
import verifyToken from "../middlewares/verifyToken.js";
import { verificarEmail } from "../controladores/verificacion.controller.js";
import { verifyRole } from "../middlewares/verifyRole.js";

const router = Router();

router.post("/registrarse", registrarse);
router.post("/login", login);
router.get("/auth/verificar", verificarEmail);

router.get("/me", verifyToken, me);
router.put("/password", verifyToken, changePass);

router.get("/admin", verifyToken, verifyRole(["admin"]), (req, res) => {
  res.json({ message: "Solo administradores" });
});

router.get("/admin/users", verifyToken, verifyRole(["admin"]), getUsers);
router.put("/admin/users/:id/ia", verifyToken, verifyRole(["admin"]), updateIaActiva);
router.post("/admin/users/:id/renovar-tokens", verifyToken, verifyRole(["admin"]), renovarTokens);
router.post("/admin/users/:id/add-tokens", verifyToken, verifyRole(["admin"]), addTokens);
router.post("/admin/users/:id/remove-tokens", verifyToken, verifyRole(["admin"]), removeTokens);

export default router;