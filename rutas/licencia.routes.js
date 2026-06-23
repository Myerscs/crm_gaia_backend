import { Router } from "express";
import verifyToken from "../middlewares/verifyToken.js";
import {
  listarLicencias,
  obtenerLicencia,
  crearLicencia,
  actualizarLicencia,
  eliminarLicencia,
} from "../controladores/licencia.controller.js";

const router = Router();
router.use(verifyToken);

router.get("/licencias", listarLicencias);
router.get("/licencias/:id", obtenerLicencia);
router.post("/licencias", crearLicencia);
router.put("/licencias/:id", actualizarLicencia);
router.delete("/licencias/:id", eliminarLicencia);

export default router;