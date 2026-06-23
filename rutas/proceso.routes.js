import { Router } from "express";

import verifyToken      from "../middlewares/verifyToken.js";

import {
  listarProcesos,
  obtenerProceso,
  crearProceso,
  actualizarProceso,
  cambiarEstatus,
  eliminarProceso,
  upsertLevantamiento,
  upsertEstimacion,
  upsertPropuesta,
  upsertPreliminar,
  upsertAprobacion,
  upsertEjecucion,
  listarInteracciones,
  crearInteraccion,
  eliminarInteraccion,
  crearInteraccionLevantamiento,
  eliminarInteraccionLevantamiento,
  crearInteraccionEstimacion,
  eliminarInteraccionEstimacion,
  listarInteraccionesLevantamiento,
  listarInteraccionesEstimacion,
  listarInteraccionesPropuesta,
  crearInteraccionPropuesta,
  eliminarInteraccionPropuesta,
  listarInteraccionesAprobacion,
  crearInteraccionAprobacion,
  eliminarInteraccionAprobacion,
  listarInteraccionesAprobado,
  crearInteraccionAprobado,
  eliminarInteraccionAprobado,
  upsertAprobado,
  listarInteraccionesEjecucion,
  crearInteraccionEjecucion,
  eliminarInteraccionEjecucion,
  upsertCierre,
  listarInteraccionesCierre,
  crearInteraccionCierre,
  eliminarInteraccionCierre,
  upsertFacturado,
  listarInteraccionesFacturado,
  crearInteraccionFacturado,
  eliminarInteraccionFacturado,
  upsertRechazado,
  listarInteraccionesRechazado,
  crearInteraccionRechazado,
  eliminarInteraccionRechazado,
  upsertStandBy,
  listarInteraccionesStandBy,
  crearInteraccionStandBy,
  eliminarInteraccionStandBy,
} from "../controladores/proceso.controller.js";

const router = Router();
router.use(verifyToken);

router.get(
  "/procesos",
  listarProcesos
);

router.get(
  "/procesos/:id",
  obtenerProceso
);

router.post(
  "/proyectos/:proyectoId/procesos",
  crearProceso
);

router.put(
  "/procesos/:id",
  actualizarProceso
);

router.patch(
  "/procesos/:id/estatus",
  cambiarEstatus
);

router.delete(
  "/procesos/:id",
  eliminarProceso
);

router.put(
  "/procesos/:id/levantamiento",
  upsertLevantamiento
);

router.put(
  "/procesos/:id/estimacion",
  upsertEstimacion
);

router.put(
  "/procesos/:id/propuesta",
  upsertPropuesta
);

router.put(
  "/procesos/:id/preliminar",
  upsertPreliminar
);

router.put(
  "/procesos/:id/aprobacion",
  upsertAprobacion
);

router.put(
  "/procesos/:id/ejecucion",
  upsertEjecucion
);

router.get(
  "/procesos/:id/interacciones",
  listarInteracciones
);

router.post(
  "/procesos/:id/interacciones",
  crearInteraccion
);

router.delete(
  "/procesos/:id/interacciones/:interaccionId",
  eliminarInteraccion
);
router.post("/procesos/:id/levantamiento/interacciones",                     crearInteraccionLevantamiento);
router.delete("/procesos/:id/levantamiento/interacciones/:interaccionId",    eliminarInteraccionLevantamiento);
router.post("/procesos/:id/estimacion/interacciones",                        crearInteraccionEstimacion);
router.delete("/procesos/:id/estimacion/interacciones/:interaccionId",       eliminarInteraccionEstimacion);
router.get("/procesos/:id/levantamiento/interacciones", listarInteraccionesLevantamiento);
router.get("/procesos/:id/estimacion/interacciones",    listarInteraccionesEstimacion);
router.get( "/procesos/:id/propuesta/interacciones",               listarInteraccionesPropuesta);
router.post("/procesos/:id/propuesta/interacciones",               crearInteraccionPropuesta);
router.delete("/procesos/:id/propuesta/interacciones/:interaccionId", eliminarInteraccionPropuesta);
router.get(   "/procesos/:id/aprobacion/interacciones",                listarInteraccionesAprobacion);
router.post(  "/procesos/:id/aprobacion/interacciones",                crearInteraccionAprobacion);
router.delete("/procesos/:id/aprobacion/interacciones/:interaccionId", eliminarInteraccionAprobacion);
router.put(   "/procesos/:id/aprobado",                                upsertAprobado);
router.get(   "/procesos/:id/aprobado/interacciones",                  listarInteraccionesAprobado);
router.post(  "/procesos/:id/aprobado/interacciones",                  crearInteraccionAprobado);
router.delete("/procesos/:id/aprobado/interacciones/:interaccionId",   eliminarInteraccionAprobado);
router.get(   "/procesos/:id/ejecucion/interacciones",                  listarInteraccionesEjecucion);
router.post(  "/procesos/:id/ejecucion/interacciones",                  crearInteraccionEjecucion);
router.delete("/procesos/:id/ejecucion/interacciones/:interaccionId",   eliminarInteraccionEjecucion);
router.put(   "/procesos/:id/cierre",                                upsertCierre);
router.get(   "/procesos/:id/cierre/interacciones",                  listarInteraccionesCierre);
router.post(  "/procesos/:id/cierre/interacciones",                  crearInteraccionCierre);
router.delete("/procesos/:id/cierre/interacciones/:interaccionId",   eliminarInteraccionCierre);
router.put(   "/procesos/:id/facturado",                                upsertFacturado);
router.get(   "/procesos/:id/facturado/interacciones",                  listarInteraccionesFacturado);
router.post(  "/procesos/:id/facturado/interacciones",                  crearInteraccionFacturado);
router.delete("/procesos/:id/facturado/interacciones/:interaccionId",   eliminarInteraccionFacturado);
router.put(   "/procesos/:id/rechazado",                                upsertRechazado);
router.get(   "/procesos/:id/rechazado/interacciones",                  listarInteraccionesRechazado);
router.post(  "/procesos/:id/rechazado/interacciones",                  crearInteraccionRechazado);
router.delete("/procesos/:id/rechazado/interacciones/:interaccionId",   eliminarInteraccionRechazado);
router.put(   "/procesos/:id/stand-by",                                upsertStandBy);
router.get(   "/procesos/:id/stand-by/interacciones",                  listarInteraccionesStandBy);
router.post(  "/procesos/:id/stand-by/interacciones",                  crearInteraccionStandBy);
router.delete("/procesos/:id/stand-by/interacciones/:interaccionId",   eliminarInteraccionStandBy);
export default router;  