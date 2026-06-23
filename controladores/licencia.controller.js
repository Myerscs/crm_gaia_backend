import { Op } from "sequelize";
import { Licencia, Cliente, Proceso, Consultor, HerramientaRpa } from "../modelos/relations.js";

export const listarLicencias = async (req, res) => {
  try {
    const { clienteId, estado, page = 1, limit = 20 } = req.query;
    const where = {};
    if (clienteId) where.cliente_id = clienteId;
    if (estado) where.estado = estado;

    const offset = (Math.max(1, +page) - 1) * +limit;
    const { count, rows } = await Licencia.findAndCountAll({
      where,
      include: [
        { model: Cliente, as: "cliente", attributes: ["id","empresa"] },
        { model: Proceso, as: "procesos", attributes: ["id", "nombre_proceso"], through: { attributes: [] } },
        { model: HerramientaRpa, as: "herramienta", attributes: ["id", "nombre"] },
        { model: Consultor, as: "creador", attributes: ["id", "nombre"] },
      ],
      order: [["createdAt", "DESC"]],
      limit: +limit,
      offset,
    });
    return res.status(200).json({ ok: true, total: count, page: +page, pages: Math.ceil(count / +limit), data: rows });
  } catch (err) {
    return res.status(500).json({ ok: false, mensaje: err.message });
  }
};

export const obtenerLicencia = async (req, res) => {
  try {
    const licencia = await Licencia.findByPk(req.params.id, {
      include: [
        { model: Cliente, as: "cliente" },
        { model: Proceso, as: "procesos" },
        { model: Consultor, as: "creador" },
        { model: HerramientaRpa, as: "herramienta" },
      ],
    });
    if (!licencia) return res.status(404).json({ ok: false, mensaje: "Licencia no encontrada." });
    return res.status(200).json({ ok: true, data: licencia });
  } catch (err) {
    return res.status(500).json({ ok: false, mensaje: err.message });
  }
};

export const crearLicencia = async (req, res) => {
  try {
    const { cliente_id, procesos_ids = [], fecha_estado, motivo_desactivacion, ...data } = req.body;
    if (!cliente_id) return res.status(400).json({ ok: false, mensaje: "cliente_id es obligatorio." });

    const licencia = await Licencia.create({
      ...data,
      cliente_id,
      fecha_estado: fecha_estado || null,
      motivo_desactivacion: motivo_desactivacion || null,
      created_by: req.usuario?.id,
    });
    if (procesos_ids.length) {
      await licencia.setProcesos(procesos_ids);
    }
    return res.status(201).json({ ok: true, mensaje: "Licencia creada.", data: licencia });
  } catch (err) {
    return res.status(500).json({ ok: false, mensaje: err.message });
  }
};

export const actualizarLicencia = async (req, res) => {
  try {
    const licencia = await Licencia.findByPk(req.params.id);
    if (!licencia) return res.status(404).json({ ok: false, mensaje: "Licencia no encontrada." });

    const { procesos_ids, fecha_estado, motivo_desactivacion, ...resto } = req.body;
    const updateData = {
      ...resto,
      updated_by: req.usuario?.id,
      fecha_estado: fecha_estado || null,
      motivo_desactivacion: motivo_desactivacion || null,
    };

    if (resto.estado && resto.estado !== licencia.estado) {
      if (!updateData.fecha_estado) {
        updateData.fecha_estado = new Date().toISOString().slice(0, 10);
      }
    }

    await licencia.update(updateData);
    if (procesos_ids !== undefined) {
      await licencia.setProcesos(procesos_ids);
    }
    return res.status(200).json({ ok: true, mensaje: "Licencia actualizada.", data: licencia });
  } catch (err) {
    return res.status(500).json({ ok: false, mensaje: err.message });
  }
};

export const eliminarLicencia = async (req, res) => {
  try {
    const licencia = await Licencia.findByPk(req.params.id);
    if (!licencia) return res.status(404).json({ ok: false, mensaje: "Licencia no encontrada." });
    await licencia.destroy();
    return res.status(200).json({ ok: true, mensaje: "Licencia eliminada." });
  } catch (err) {
    return res.status(500).json({ ok: false, mensaje: err.message });
  }
};