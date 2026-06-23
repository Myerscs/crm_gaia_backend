import { Op } from "sequelize";
import { Soporte, Cliente, UsuarioCliente, Consultor } from "../modelos/relations.js";

export const listarSoportes = async (req, res) => {
  try {
    const { clienteId, estado, page = 1, limit = 20 } = req.query;
    const where = {};
    if (clienteId) where.cliente_id = clienteId;
    if (estado) where.estado = estado;

    const offset = (Math.max(1, +page) - 1) * +limit;
    const { count, rows } = await Soporte.findAndCountAll({
      where,
      include: [
        { model: Cliente, as: "cliente", attributes: ["id","empresa"] },
        { model: UsuarioCliente, as: "responsableCliente", attributes: ["id", "nombre", "email"] },
        { model: Consultor, as: "creador", attributes: ["id", "nombre"] },
        { model: Consultor, as: "actualizador", attributes: ["id", "nombre"] },
      ],
      order: [["createdAt", "DESC"]],
      limit: +limit,
      offset,
    });
    return res.status(200).json({ ok: true, total: count, page: +page, pages: Math.ceil(count / +limit), data: rows });
  } catch (err) {
    console.error("[listarSoportes]", err);
    return res.status(500).json({ ok: false, mensaje: "Error al listar soportes.", detalle: err.message });
  }
};

export const obtenerSoporte = async (req, res) => {
  try {
    const soporte = await Soporte.findByPk(req.params.id, {
      include: [
        { model: Cliente, as: "cliente" },
        { model: UsuarioCliente, as: "responsableCliente" },
        { model: Consultor, as: "creador" },
        { model: Consultor, as: "actualizador" },
      ],
    });
    if (!soporte) return res.status(404).json({ ok: false, mensaje: "Soporte no encontrado." });
    return res.status(200).json({ ok: true, data: soporte });
  } catch (err) {
    return res.status(500).json({ ok: false, mensaje: err.message });
  }
};

// Helper: convierte string vacío o inválido a null
const sanitizeDate = (val) => {
  if (!val || val === '' || val === 'Invalid date') return null;
  return val;
};

export const crearSoporte = async (req, res) => {
  try {
    const { cliente_id, ...data } = req.body;
    if (!cliente_id) return res.status(400).json({ ok: false, mensaje: "cliente_id es obligatorio." });

    const soporte = await Soporte.create({
      ...data,
      cliente_id,
      created_by: req.usuario?.id,
      fecha_inicio:         sanitizeDate(data.fecha_inicio),
      fecha_fin:            sanitizeDate(data.fecha_fin),
      fecha_aprobacion:     sanitizeDate(data.fecha_aprobacion),
      fecha_rechazo:        sanitizeDate(data.fecha_rechazo),
      fecha_inicio_soporte: sanitizeDate(data.fecha_inicio_soporte),
    });
    return res.status(201).json({ ok: true, mensaje: "Soporte creado.", data: soporte });
  } catch (err) {
    console.error("[crearSoporte]", err);
    return res.status(500).json({ ok: false, mensaje: "Error al crear soporte.", detalle: err.message });
  }
};

export const actualizarSoporte = async (req, res) => {
  try {
    const soporte = await Soporte.findByPk(req.params.id);
    if (!soporte) return res.status(404).json({ ok: false, mensaje: "Soporte no encontrado." });

    const { estado, fecha_aprobacion, fecha_rechazo, motivo_rechazo, ...resto } = req.body;
    const updateData = {
      ...resto,
      updated_by: req.usuario?.id,
      // Sanitizar fechas del resto
      fecha_inicio:         sanitizeDate(resto.fecha_inicio),
      fecha_fin:            sanitizeDate(resto.fecha_fin),
      fecha_inicio_soporte: sanitizeDate(resto.fecha_inicio_soporte),
    };

    if (estado && estado !== soporte.estado) {
      updateData.estado = estado;
      if (estado === "Aprobado")  updateData.fecha_aprobacion = new Date().toISOString().slice(0, 10);
      if (estado === "Rechazado") updateData.fecha_rechazo    = new Date().toISOString().slice(0, 10);
    }

    if (fecha_aprobacion) updateData.fecha_aprobacion = sanitizeDate(fecha_aprobacion);
    if (fecha_rechazo)    updateData.fecha_rechazo    = sanitizeDate(fecha_rechazo);
    if (motivo_rechazo)   updateData.motivo_rechazo   = motivo_rechazo;

    await soporte.update(updateData);
    return res.status(200).json({ ok: true, mensaje: "Soporte actualizado.", data: soporte });
  } catch (err) {
    return res.status(500).json({ ok: false, mensaje: err.message });
  }
};

export const eliminarSoporte = async (req, res) => {
  try {
    const soporte = await Soporte.findByPk(req.params.id);
    if (!soporte) return res.status(404).json({ ok: false, mensaje: "Soporte no encontrado." });
    await soporte.destroy();
    return res.status(200).json({ ok: true, mensaje: "Soporte eliminado." });
  } catch (err) {
    return res.status(500).json({ ok: false, mensaje: err.message });
  }
};