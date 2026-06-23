import { Router } from "express";
import verifyToken from "../middlewares/verifyToken.js";
import { listarSoportes, obtenerSoporte, crearSoporte, actualizarSoporte, eliminarSoporte } from "../controladores/soporte.controller.js";

const router = Router();
router.use(verifyToken);
router.get("/soportes", listarSoportes);
router.get("/soportes/:id", obtenerSoporte);
router.post("/soportes", crearSoporte);
router.put("/soportes/:id", actualizarSoporte);
router.delete("/soportes/:id", eliminarSoporte);
export default router;