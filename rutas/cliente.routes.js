import { Router } from "express";
import verifyToken from "../middlewares/verifyToken.js";

import {
  listarClientes,
  obtenerCliente,
  crearCliente,
  actualizarCliente,
  eliminarCliente,
  restaurarCliente,
  listarUsuarios,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  listarSeguimientos,
  crearSeguimiento,
  actualizarSeguimiento,
  eliminarSeguimiento,
  listarPaises,
  listarCiudadesPorPais,
  listarRubros,
} from "../controladores/cliente.controller.js";

const router = Router();

router.use(verifyToken);

router.get("/catalogos/paises",                listarPaises);
router.get("/catalogos/paises/:paisId/ciudades", listarCiudadesPorPais);
router.get("/catalogos/rubros",                listarRubros);

router.get(   "/clientes",          listarClientes);
router.get(   "/clientes/:id",      obtenerCliente);
router.post(  "/clientes",          crearCliente);
router.put(   "/clientes/:id",      actualizarCliente);
router.delete("/clientes/:id",      eliminarCliente);
router.patch( "/clientes/:id/restaurar", restaurarCliente);

router.get(   "/clientes/:clienteId/usuarios",              listarUsuarios);
router.post(  "/clientes/:clienteId/usuarios",              crearUsuario);
router.put(   "/clientes/:clienteId/usuarios/:usuarioId",   actualizarUsuario);
router.delete("/clientes/:clienteId/usuarios/:usuarioId",   eliminarUsuario);

router.get(   "/clientes/:clienteId/seguimientos",                    listarSeguimientos);
router.post(  "/clientes/:clienteId/seguimientos",                    crearSeguimiento);
router.put(   "/clientes/:clienteId/seguimientos/:seguimientoId",     actualizarSeguimiento);
router.delete("/clientes/:clienteId/seguimientos/:seguimientoId",     eliminarSeguimiento);

export default router;