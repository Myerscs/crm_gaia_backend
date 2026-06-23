import { Router } from "express";
import verifyToken from "../middlewares/verifyToken.js";
import {
  getClientesResumen,
  getProyectosDeCliente,
  getProcesosDeProyecto,
} from "../controladores/pipeline.controller.js";

const router = Router();
router.use(verifyToken);

router.get("/pipeline/clientes", getClientesResumen);
router.get("/pipeline/clientes/:clienteId/proyectos", getProyectosDeCliente);
router.get("/pipeline/proyectos/:proyectoId/procesos", getProcesosDeProyecto);

export default router;
