import { Op } from "sequelize";
import { sequelize } from "../config/database.js";
import {
  Cliente,
  UsuarioCliente,
  SeguimientoCliente,
  Consultor,
  Pais,
  Ciudad,
  Rubro,
  SeguimientoContacto,
  Proyecto,
  Estados,
} from "../modelos/relations.js";
import { emailValido } from "../utils/verifyEmail.js";
import { callSeguimientoContext } from "../AI/callSeguimientoContext.js";
import { getEstadoId, resolverEstadoId } from "../Helpers/h_estados.js";
import { delPattern, getCache, setCache } from "../utils/cache.js";
import { INCLUDE_CLIENTE } from "../Helpers/h_cliente.js";

export const listarClientes = async (req, res) => {
  try {
    const { search, estado, rubro_id, pais_id, page = 1, limit = 20 } = req.query;
    const cacheKey = `clientes:${search ?? ""}:${estado ?? ""}:${rubro_id ?? ""}:${pais_id ?? ""}:${page}:${limit}`;

    const cached = await getCache(cacheKey);
    if (cached) return res.status(200).json({ ...cached, cached: true });

    const where = {};
    if (search) where.empresa = { [Op.iLike]: `%${search.trim()}%` };
    if (estado) where.estado = estado;
    if (rubro_id) where.rubro_id = rubro_id;
    if (pais_id) where.pais_id = pais_id;
    if (estado) where.estado_id = await resolverEstadoId(estado);


    const offset = (Math.max(1, +page) - 1) * +limit;

    const { count, rows } = await Cliente.findAndCountAll({
      where,
      include: INCLUDE_CLIENTE,
      order: [["empresa", "ASC"]],
      limit: +limit,
      offset,
      distinct: true,
    });

    const result = { ok: true, total: count, page: +page, pages: Math.ceil(count / +limit), data: rows };
    await setCache(cacheKey, result, 60 * 2);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ ok: false, mensaje: "Error al listar clientes.", detalle: err.message });
  }
};

// ─────────────────────────────────────────────────────────────
export const obtenerCliente = async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id, {
      include: INCLUDE_CLIENTE,
    });

    if (!cliente) return res.status(404).json({ ok: false, mensaje: "Cliente no encontrado." });

    return res.status(200).json({ ok: true, data: cliente });
  } catch (err) {
    console.error("[obtenerCliente]", err);
    return res.status(500).json({ ok: false, mensaje: "Error al obtener cliente.", detalle: err.message });
  }
};

// ─────────────────────────────────────────────────────────────
export const crearCliente = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const {
      empresa,
      pais_id, ciudad_id, direccion,
      rubro_id, estado = "Lead",
      referido_por,
      precio_hora_desarrollo, precio_hora_soporte,
      precio_hora_cambio, porcentaje_gobierno,
      nota,
      usuarios = [],
    } = req.body;

    if (!empresa?.trim()) {
      await t.rollback();
      return res.status(400).json({ ok: false, mensaje: "'empresa' es obligatoria." });
    }

    const existe = await Cliente.findOne({ where: { empresa: empresa.trim() } });
    if (existe) {
      await t.rollback();
      return res.status(409).json({ ok: false, mensaje: "Ya existe un cliente con ese nombre de empresa." });
    }

    // Validar FK opcionales
    if (pais_id && !(await Pais.findByPk(pais_id))) {
      await t.rollback();
      return res.status(400).json({ ok: false, mensaje: "País no válido." });
    }
    if (ciudad_id) {
      const ciudad = await Ciudad.findByPk(ciudad_id);
      if (!ciudad) { await t.rollback(); return res.status(400).json({ ok: false, mensaje: "Ciudad no válida." }); }
      if (pais_id && ciudad.pais_id !== +pais_id) {
        await t.rollback();
        return res.status(400).json({ ok: false, mensaje: "La ciudad no pertenece al país indicado." });
      }
    }
    if (rubro_id && !(await Rubro.findByPk(rubro_id))) {
      await t.rollback();
      return res.status(400).json({ ok: false, mensaje: "Rubro no válido." });
    }

    const estado_id = await resolverEstadoId(estado);

    const cliente = await Cliente.create({
      empresa: empresa.trim(),
      pais_id: pais_id ?? null,
      ciudad_id: ciudad_id ?? null,
      direccion: direccion?.trim() || null,
      rubro_id: rubro_id ?? null,
      estado_id,
      referido_por: referido_por?.trim() || null,
      precio_hora_desarrollo: precio_hora_desarrollo ?? null,
      precio_hora_soporte: precio_hora_soporte ?? null,
      precio_hora_cambio: precio_hora_cambio ?? null,
      porcentaje_gobierno: porcentaje_gobierno ?? null,
      nota: nota || null,
    }, { transaction: t });

    if (usuarios.length > 0) {
      const data = usuarios.map(u => ({ ...u, cliente_id: cliente.id }));
      await UsuarioCliente.bulkCreate(data, { transaction: t });
    }

    await t.commit();
    const resultado = await Cliente.findByPk(cliente.id, { include: INCLUDE_CLIENTE });
    return res.status(201).json({ ok: true, mensaje: "Cliente creado.", data: resultado });
  } catch (err) {
    await t.rollback();
    console.error("[crearCliente]", err);
    return res.status(500).json({ ok: false, mensaje: "Error al crear cliente.", detalle: err.message });
  } finally {
    await delPattern("clientes:*");
  }
};

export const actualizarCliente = async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id);
    if (!cliente) return res.status(404).json({ ok: false, mensaje: "Cliente no encontrado." });

    const {
      empresa,
      pais_id, ciudad_id, direccion,
      rubro_id, estado, estado_id: estadoIdBody,
      referido_por,
      precio_hora_desarrollo, precio_hora_soporte,
      precio_hora_cambio, porcentaje_gobierno,
      nota,
    } = req.body;

    if (empresa && empresa.trim() !== cliente.empresa) {
      const dup = await Cliente.findOne({ where: { empresa: empresa.trim() } });
      if (dup) return res.status(409).json({ ok: false, mensaje: "Nombre de empresa ya en uso." });
    }

    const nuevoPaisId = pais_id !== undefined ? pais_id : cliente.pais_id;
    const nuevaCiudadId = ciudad_id !== undefined ? ciudad_id : cliente.ciudad_id;
    if (nuevaCiudadId && nuevoPaisId) {
      const ciudad = await Ciudad.findByPk(nuevaCiudadId);
      if (ciudad && ciudad.pais_id !== +nuevoPaisId) {
        return res.status(400).json({ ok: false, mensaje: "La ciudad no pertenece al país indicado." });
      }
    }

    const estado_id = estadoIdBody
      ? estadoIdBody
      : estado
        ? await resolverEstadoId(estado)
        : cliente.estado_id;

    await cliente.update({
      empresa: empresa?.trim() || cliente.empresa,
      pais_id: pais_id !== undefined ? pais_id : cliente.pais_id,
      ciudad_id: ciudad_id !== undefined ? ciudad_id : cliente.ciudad_id,
      direccion: direccion !== undefined ? direccion?.trim() || null : cliente.direccion,
      rubro_id: rubro_id !== undefined ? rubro_id : cliente.rubro_id,
      estado_id,
      referido_por: referido_por !== undefined ? referido_por?.trim() || null : cliente.referido_por,
      precio_hora_desarrollo: precio_hora_desarrollo ?? null,
      precio_hora_soporte: precio_hora_soporte ?? null,
      precio_hora_cambio: precio_hora_cambio ?? null,
      porcentaje_gobierno: porcentaje_gobierno ?? null,
      nota: nota ?? null,
    });

    const resultado = await Cliente.findByPk(cliente.id, { include: INCLUDE_CLIENTE });
    return res.status(200).json({ ok: true, mensaje: "Cliente actualizado.", data: resultado });
  } catch (err) {
    console.error("[actualizarCliente]", err);
    return res.status(500).json({ ok: false, mensaje: "Error al actualizar cliente.", detalle: err.message });
  } finally {
    await delPattern("clientes:*");
  }
};

export const eliminarCliente = async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id);
    if (!cliente) return res.status(404).json({ ok: false, mensaje: "Cliente no encontrado." });

    const estadoInactivo = await getEstadoId("Inactivo");
    if (cliente.estado_id === estadoInactivo)
      return res.status(400).json({ ok: false, mensaje: "El cliente ya está inactivo." });

    await cliente.update({ estado_id: estadoInactivo });
    return res.status(200).json({ ok: true, mensaje: "Cliente desactivado.", data: cliente });
  } catch (err) {
    return res.status(500).json({ ok: false, mensaje: err.message });
  } finally {
    await delPattern("clientes:*");
  }
};

export const restaurarCliente = async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id);
    if (!cliente) return res.status(404).json({ ok: false, mensaje: "Cliente no encontrado." });

    const [estadoInactivo, estadoActivo] = await Promise.all([
      getEstadoId("Inactivo"),
      getEstadoId("Activo"),
    ]);

    if (cliente.estado_id !== estadoInactivo)
      return res.status(400).json({ ok: false, mensaje: "El cliente no está inactivo." });

    await cliente.update({ estado_id: estadoActivo });
    const resultado = await Cliente.findByPk(cliente.id, { include: INCLUDE_CLIENTE });
    return res.status(200).json({ ok: true, mensaje: "Cliente reactivado.", data: resultado });
  } catch (err) {
    return res.status(500).json({ ok: false, mensaje: err.message });
  } finally {
    await delPattern("clientes:*");
  }
};

export const listarUsuarios = async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.clienteId);
    if (!cliente) return res.status(404).json({ ok: false, mensaje: "Cliente no encontrado." });

    const usuarios = await UsuarioCliente.findAll({
      where: { cliente_id: req.params.clienteId },
      order: [["nombre", "ASC"]],
    });

    return res.status(200).json({ ok: true, data: usuarios });
  } catch (err) {
    console.error("[listarUsuarios]", err);
    return res.status(500).json({ ok: false, mensaje: "Error al obtener usuarios.", detalle: err.message });
  }
};

export const crearUsuario = async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.clienteId);
    if (!cliente) return res.status(404).json({ ok: false, mensaje: "Cliente no encontrado." });

    const { nombre, email, telefono, linkedin, cargo } = req.body;
    if (!nombre?.trim()) return res.status(400).json({ ok: false, mensaje: "'nombre' es obligatorio." });
    if (!emailValido(email)) return res.status(400).json({ ok: false, mensaje: "Email inválido." });

    const usuario = await UsuarioCliente.create({
      cliente_id: req.params.clienteId,
      nombre: nombre.trim(),
      email,
      telefono,
      linkedin,
      cargo,
    });

    return res.status(201).json({ ok: true, mensaje: "Usuario creado.", data: usuario });
  } catch (err) {
    console.error("[crearUsuario]", err);
    return res.status(500).json({ ok: false, mensaje: "Error al crear usuario.", detalle: err.message });
  }
};

export const actualizarUsuario = async (req, res) => {
  try {
    const usuario = await UsuarioCliente.findOne({
      where: { id: req.params.usuarioId, cliente_id: req.params.clienteId },
    });
    if (!usuario) return res.status(404).json({ ok: false, mensaje: "Usuario no encontrado." });

    const { nombre, cargo, activo, email, linkedin, telefono } = req.body;
    if (email && !emailValido(email)) return res.status(400).json({ ok: false, mensaje: "Email inválido." });

    await usuario.update({ nombre, cargo, activo, email, linkedin, telefono });
    return res.status(200).json({ ok: true, mensaje: "Usuario actualizado.", data: usuario });
  } catch (err) {
    console.error("[actualizarUsuario]", err);
    return res.status(500).json({ ok: false, mensaje: "Error al actualizar usuario.", detalle: err.message });
  }
};

export const eliminarUsuario = async (req, res) => {
  try {
    const usuario = await UsuarioCliente.findOne({
      where: { id: req.params.usuarioId, cliente_id: req.params.clienteId },
    });
    if (!usuario) return res.status(404).json({ ok: false, mensaje: "Usuario no encontrado." });

    await usuario.destroy();
    return res.status(200).json({ ok: true, mensaje: "Usuario eliminado." });
  } catch (err) {
    console.error("[eliminarUsuario]", err);
    return res.status(500).json({ ok: false, mensaje: "Error al eliminar usuario.", detalle: err.message });
  }
};


export const listarSeguimientos = async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.clienteId);
    if (!cliente) return res.status(404).json({ ok: false, mensaje: "Cliente no encontrado." });

    const { estado, medio, tipo, page = 1, limit = 20 } = req.query;
    const where = { cliente_id: req.params.clienteId };
    if (estado) where.estado = estado;
    if (medio) where.medio = medio;
    if (tipo) where.tipo = tipo;

    const offset = (Math.max(1, +page) - 1) * +limit;
    const { count, rows } = await SeguimientoCliente.findAndCountAll({
      where,
      include: INCLUDE_SEG,
      order: [["fecha", "ASC"]],
      limit: +limit,
      offset,
      distinct: true,
    });

    return res.status(200).json({
      ok: true,
      total: count,
      page: +page,
      pages: Math.ceil(count / +limit),
      data: rows,
    });
  } catch (err) {
    console.error("[listarSeguimientos]", err);
    return res.status(500).json({ ok: false, mensaje: "Error al listar seguimientos.", detalle: err.message });
  }
};
// ── Helper: genera y guarda el contexto IA del seguimiento ────
const generarContextoSeguimiento = async (clienteId, nuevoSeguimientoId) => {
  try {
    // 1. Cargar el cliente con sus includes
    const cliente = await Cliente.findByPk(clienteId, {
      include: [
        { model: Pais, as: "pais", attributes: ["id", "nombre"] },
        { model: Ciudad, as: "ciudad", attributes: ["id", "nombre"] },
        { model: Rubro, as: "rubro", attributes: ["id", "nombre"] },
      ],
    });
    if (!cliente) return;

    // 2. Separar historial anterior del seguimiento nuevo
    const todos = await SeguimientoCliente.findAll({
      where: { cliente_id: clienteId },
      include: [
        { model: Consultor, as: "consultor", attributes: ["id", "nombre"] },
        { model: UsuarioCliente, as: "contacto_cliente", attributes: ["id", "nombre"] },
      ],
      order: [["fecha", "ASC"]],
    });

    const nuevoSeg = todos.find(s => s.id === nuevoSeguimientoId);
    const anteriores = todos.filter(s => s.id !== nuevoSeguimientoId);

    if (!nuevoSeg) return;

    const respuestaIA = await callSeguimientoContext("seguimiento_context", {
      cliente,
      seguimientos_anteriores: anteriores,
      seguimiento_nuevo: nuevoSeg,
    });

    const contexto = typeof respuestaIA === "string" ? JSON.parse(respuestaIA) : respuestaIA;
    await nuevoSeg.update({ contexto_seguimiento: contexto });
  } catch (err) {
    console.error("[generarContextoSeguimiento] Error al generar contexto IA:", err.message);
  }
};

const INCLUDE_SEG = [
  { model: Consultor, as: "consultor", attributes: ["id", "nombre", "email"] },
  {
    model: UsuarioCliente, as: "contactos", attributes: ["id", "nombre", "email", "telefono", "linkedin", "cargo"],
    through: { attributes: [] }
  },
];

const ESTADOS_SEGUIMIENTO_VALIDOS = ["programado", "completado", "cancelado"];

export const crearSeguimiento = async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.clienteId);
    if (!cliente) return res.status(404).json({ ok: false, mensaje: "Cliente no encontrado." });

    const {
      consultor_id,
      contactos_ids = [],
      fecha,
      fecha_proxima_accion,
      medio,
      tipo,
      descripcion,
      resultado,
    } = req.body;

    const estado = ESTADOS_SEGUIMIENTO_VALIDOS.includes(req.body.estado)
      ? req.body.estado
      : "programado";

    if (!consultor_id) return res.status(400).json({ ok: false, mensaje: "'consultor_id' es obligatorio." });
    if (!fecha) return res.status(400).json({ ok: false, mensaje: "'fecha' es obligatoria." });
    if (!medio) return res.status(400).json({ ok: false, mensaje: "'medio' es obligatorio." });
    if (!tipo) return res.status(400).json({ ok: false, mensaje: "'tipo' es obligatorio." });
    if (!descripcion?.trim()) return res.status(400).json({ ok: false, mensaje: "'descripcion' es obligatoria." });

    const consultor = await Consultor.findByPk(consultor_id);
    if (!consultor) return res.status(400).json({ ok: false, mensaje: "Consultor no encontrado." });

    if (contactos_ids.length > 0) {
      const contactosValidos = await UsuarioCliente.findAll({
        where: { id: contactos_ids, cliente_id: req.params.clienteId },
      });
      if (contactosValidos.length !== contactos_ids.length)
        return res.status(400).json({ ok: false, mensaje: "Uno o más contactos no pertenecen a este cliente." });
    }

    const seguimiento = await SeguimientoCliente.create({
      cliente_id: req.params.clienteId,
      consultor_id,
      fecha,
      fecha_proxima_accion: fecha_proxima_accion ?? null,
      medio,
      tipo,
      descripcion: descripcion.trim(),
      resultado: resultado?.trim() || null,
      estado,
      contexto_seguimiento: null,
    });

    if (contactos_ids.length > 0) {
      await seguimiento.setContactos(contactos_ids);
    }

    const resultado_final = await SeguimientoCliente.findByPk(seguimiento.id, {
      include: INCLUDE_SEG,
    });

    res.status(201).json({ ok: true, mensaje: "Seguimiento registrado.", data: resultado_final });

    generarContextoSeguimiento(req.params.clienteId, seguimiento.id);

  } catch (err) {
    console.error("[crearSeguimiento]", err);
    return res.status(500).json({ ok: false, mensaje: "Error al crear seguimiento.", detalle: err.message });
  }
};

export const actualizarSeguimiento = async (req, res) => {
  try {
    const seguimiento = await SeguimientoCliente.findOne({
      where: { id: req.params.seguimientoId, cliente_id: req.params.clienteId },
      include: INCLUDE_SEG,
    });
    if (!seguimiento) return res.status(404).json({ ok: false, mensaje: "Seguimiento no encontrado." });

    const {
      fecha,
      fecha_proxima_accion,
      medio,
      tipo,
      descripcion,
      resultado,
      estado,
      contactos_ids,
    } = req.body;

    if (estado && !ESTADOS_SEGUIMIENTO_VALIDOS.includes(estado))
      return res.status(400).json({ ok: false, mensaje: `'estado' inválido. Valores permitidos: ${ESTADOS_SEGUIMIENTO_VALIDOS.join(", ")}.` });

    if (contactos_ids !== undefined && contactos_ids.length > 0) {
      const contactosValidos = await UsuarioCliente.findAll({
        where: { id: contactos_ids, cliente_id: req.params.clienteId },
      });
      if (contactosValidos.length !== contactos_ids.length)
        return res.status(400).json({ ok: false, mensaje: "Uno o más contactos no pertenecen a este cliente." });
    }

    await seguimiento.update({
      fecha: fecha ?? seguimiento.fecha,
      fecha_proxima_accion: fecha_proxima_accion !== undefined ? fecha_proxima_accion : seguimiento.fecha_proxima_accion,
      medio: medio ?? seguimiento.medio,
      tipo: tipo ?? seguimiento.tipo,
      descripcion: descripcion?.trim() ?? seguimiento.descripcion,
      resultado: resultado !== undefined ? resultado?.trim() || null : seguimiento.resultado,
      estado: estado ?? seguimiento.estado,
    });

    if (contactos_ids !== undefined) {
      await seguimiento.setContactos(contactos_ids);
    }

    const resultado_final = await SeguimientoCliente.findByPk(seguimiento.id, {
      include: INCLUDE_SEG,
    });

    const camposRelevantes = ["descripcion", "resultado", "estado", "fecha", "medio", "tipo"];
    const cambioRelevante = camposRelevantes.some(c => req.body[c] !== undefined);
    if (cambioRelevante) {
      generarContextoSeguimiento(req.params.clienteId, seguimiento.id);
    }

    return res.status(200).json({ ok: true, mensaje: "Seguimiento actualizado.", data: resultado_final });

  } catch (err) {
    console.error("[actualizarSeguimiento]", err);
    return res.status(500).json({ ok: false, mensaje: "Error al actualizar seguimiento.", detalle: err.message });
  }
};

export const eliminarSeguimiento = async (req, res) => {
  try {
    const seguimiento = await SeguimientoCliente.findOne({
      where: { id: req.params.seguimientoId, cliente_id: req.params.clienteId },
    });
    if (!seguimiento) return res.status(404).json({ ok: false, mensaje: "Seguimiento no encontrado." });

    await seguimiento.destroy();
    return res.status(200).json({ ok: true, mensaje: "Seguimiento eliminado." });
  } catch (err) {
    console.error("[eliminarSeguimiento]", err);
    return res.status(500).json({ ok: false, mensaje: "Error al eliminar seguimiento.", detalle: err.message });
  }
};

// ══════════════════════════════════════════════════════════════
// CATÁLOGOS — solo lectura
// ══════════════════════════════════════════════════════════════

export const listarPaises = async (_req, res) => {
  try {
    const paises = await Pais.findAll({ order: [["nombre", "ASC"]] });
    return res.status(200).json({ ok: true, data: paises });
  } catch (err) {
    return res.status(500).json({ ok: false, mensaje: "Error al listar países.", detalle: err.message });
  }
};

export const listarCiudadesPorPais = async (req, res) => {
  try {
    const ciudades = await Ciudad.findAll({
      where: { pais_id: req.params.paisId },
      order: [["nombre", "ASC"]],
    });
    return res.status(200).json({ ok: true, data: ciudades });
  } catch (err) {
    return res.status(500).json({ ok: false, mensaje: "Error al listar ciudades.", detalle: err.message });
  }
};

export const listarRubros = async (_req, res) => {
  try {
    const rubros = await Rubro.findAll({ order: [["nombre", "ASC"]] });
    return res.status(200).json({ ok: true, data: rubros });
  } catch (err) {
    return res.status(500).json({ ok: false, mensaje: "Error al listar rubros.", detalle: err.message });
  }
};