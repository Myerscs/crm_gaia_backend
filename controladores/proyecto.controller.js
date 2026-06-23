import { Op } from "sequelize";
import { sequelize } from "../config/database.js";
import {
  Proyecto,
  Cliente,
  Rol,
  UsuarioCliente,
  ProyectoArea,
  ProyectoUsuarioRol,
  AsignacionHerramientas,
  HerramientaRpa,
  Consultor,
  EstadoProyecto,
} from "../modelos/relations.js";
import { INCLUDE_PROYECTO } from "../Helpers/h_proyecto.js";
import { getEstadoId, resolverEstadoId } from "../Helpers/h_estados.js";
import { delPattern, getCache, setCache } from "../utils/cache.js";

export const listarProyectos = async (req, res) => {
  try {
    const { clienteId, activo, search, page = 1, limit = 20 } = req.query;
    const where = {};
    const cacheKey = `proyectos:${clienteId ?? ""}:${activo ?? ""}:${search ?? ""}:${page}:${limit}`;
    const cached = await getCache(cacheKey);
    if (cached) return res.status(200).json({ ...cached, cached: true });
    if (clienteId) where.cliente_id = clienteId;
    if (activo !== undefined) where.activo = activo === "true";
    if (search) where.nombre = { [Op.iLike]: `%${search.trim()}%` };

    const offset = (Math.max(1, +page) - 1) * +limit;
    const { count, rows } = await Proyecto.findAndCountAll({
      where, include: INCLUDE_PROYECTO,
      order: [["createdAt", "DESC"]], limit: +limit, offset, distinct: true,
    });
    const result = { ok: true, total: count, page: +page, pages: Math.ceil(count / +limit), data: rows };
    await setCache(cacheKey, result, 60 * 2);
    return res.status(200).json({
      ok: true, total: count, page: +page, pages: Math.ceil(count / +limit), data: rows,
    });
  } catch (err) {
    console.error("[listarProyectos]", err);
    return res.status(500).json({ ok: false, mensaje: "Error al listar proyectos.", detalle: err.message });
  }
};

export const obtenerProyecto = async (req, res) => {
  try {
    const proyecto = await Proyecto.findByPk(req.params.id, { include: INCLUDE_PROYECTO });
    if (!proyecto) return res.status(404).json({ ok: false, mensaje: "Proyecto no encontrado." });

    return res.status(200).json({ ok: true, data: proyecto });
  } catch (err) {
    console.error("[obtenerProyecto]", err);
    return res.status(500).json({ ok: false, mensaje: "Error al obtener proyecto.", detalle: err.message });
  }
};

export const crearProyecto = async (req, res) => {
  const t = await sequelize.transaction();
  let proyectoId = null;

  try {
    const { cliente_id, nombre, descripcion, areas = [] } = req.body;

    if (!cliente_id) { await t.rollback(); return res.status(400).json({ ok: false, mensaje: "'cliente_id' es obligatorio." }); }
    if (!nombre?.trim()) { await t.rollback(); return res.status(400).json({ ok: false, mensaje: "'nombre' es obligatorio." }); }

    const cliente = await Cliente.findByPk(cliente_id);
    if (!cliente) { await t.rollback(); return res.status(404).json({ ok: false, mensaje: "Cliente no encontrado." }); }

    const tarifasSnapshot = {
      precio_hora_desarrollo: cliente.precio_hora_desarrollo ?? null,
      precio_hora_soporte: cliente.precio_hora_soporte ?? null,
      precio_hora_cambio: cliente.precio_hora_cambio ?? null,
      porcentaje_gobierno: cliente.porcentaje_gobierno ?? null,
    };

    const estadoLeadId = await getEstadoId("Lead");

    const proyecto = await Proyecto.create({
      cliente_id,
      nombre: nombre.trim(),
      descripcion,
      estado_id: estadoLeadId,
      ...tarifasSnapshot,
    }, { transaction: t });

    await EstadoProyecto.create({
      proyecto_id: proyecto.id,
      estado_id: estadoLeadId,
      observacion: "",
      fecha: new Date(),
    }, { transaction: t });

    if (areas.length > 0) {
      await ProyectoArea.bulkCreate(
        areas.map((area_id) => ({ proyecto_id: proyecto.id, area_id })),
        { ignoreDuplicates: true, transaction: t }
      );
    }

    proyectoId = proyecto.id;
    await t.commit();

  } catch (err) {
    await t.rollback();
    console.error("[crearProyecto]", err);
    return res.status(500).json({ ok: false, mensaje: "Error al crear proyecto.", detalle: err.message });
  }

  try {
    const resultado = await Proyecto.findByPk(proyectoId, { include: INCLUDE_PROYECTO });
    return res.status(201).json({ ok: true, mensaje: "Proyecto creado.", data: resultado });
  } catch (err) {
    console.error("[crearProyecto - lectura final]", err);
    return res.status(201).json({ ok: true, mensaje: "Proyecto creado.", data: { id: proyectoId } });
  }finally {
    await delPattern("proyectos:*");
  }
};
export const actualizarProyecto = async (req, res) => {
  try {
    const proyecto = await Proyecto.findByPk(req.params.id);
    if (!proyecto) return res.status(404).json({ ok: false, mensaje: "Proyecto no encontrado." });

    const { nombre, descripcion, activo } = req.body;
    await proyecto.update({
      nombre,
      descripcion,
      activo,
    });

    const resultado = await Proyecto.findByPk(proyecto.id, { include: INCLUDE_PROYECTO });
    return res.status(200).json({ ok: true, mensaje: "Proyecto actualizado.", data: resultado });
  } catch (err) {
    console.error("[actualizarProyecto]", err);
    return res.status(500).json({ ok: false, mensaje: "Error al actualizar proyecto.", detalle: err.message });
  } finally {
    await delPattern("proyectos:*");
  }
};

export const eliminarProyecto = async (req, res) => {
  try {
    const proyecto = await Proyecto.findByPk(req.params.id);
    if (!proyecto) return res.status(404).json({ ok: false, mensaje: "Proyecto no encontrado." });

    await proyecto.update({ activo: false });
    return res.status(200).json({ ok: true, mensaje: "Proyecto desactivado." });
  } catch (err) {
    console.error("[eliminarProyecto]", err);
    return res.status(500).json({ ok: false, mensaje: "Error al eliminar proyecto.", detalle: err.message });
  } finally {
    await delPattern("proyectos:*");
  }
};

export const agregarAreas = async (req, res) => {
  try {
    const proyecto = await Proyecto.findByPk(req.params.id);
    if (!proyecto) return res.status(404).json({ ok: false, mensaje: "Proyecto no encontrado." });

    const { areas } = req.body;
    if (!Array.isArray(areas) || areas.length === 0)
      return res.status(400).json({ ok: false, mensaje: "'areas' debe ser un array no vacío." });

    await ProyectoArea.bulkCreate(
      areas.map((area_id) => ({ proyecto_id: proyecto.id, area_id })),
      { ignoreDuplicates: true }
    );

    const resultado = await Proyecto.findByPk(proyecto.id, { include: INCLUDE_PROYECTO });
    return res.status(200).json({ ok: true, mensaje: "Áreas agregadas.", data: resultado });
  } catch (err) {
    console.error("[agregarAreas]", err);
    return res.status(500).json({ ok: false, mensaje: "Error al agregar áreas.", detalle: err.message });
  } finally {
    await delPattern("proyectos:*");
  }
};

export const quitarArea = async (req, res) => {
  try {
    const eliminado = await ProyectoArea.destroy({
      where: { proyecto_id: req.params.id, area_id: req.params.areaId },
    });
    if (!eliminado) return res.status(404).json({ ok: false, mensaje: "Relación proyecto-área no encontrada." });

    return res.status(200).json({ ok: true, mensaje: "Área desvinculada." });
  } catch (err) {
    console.error("[quitarArea]", err);
    return res.status(500).json({ ok: false, mensaje: "Error al quitar área.", detalle: err.message });
  } finally {
    await delPattern("proyectos:*");
  }
};

export const agregarMiembro = async (req, res) => {
  try {
    const proyecto = await Proyecto.findByPk(req.params.id);
    if (!proyecto) return res.status(404).json({ ok: false, mensaje: "Proyecto no encontrado." });

    const { usuario_cliente_id, rol_id, nota } = req.body;
    if (!usuario_cliente_id) return res.status(400).json({ ok: false, mensaje: "'usuario_cliente_id' es obligatorio." });
    if (!rol_id) return res.status(400).json({ ok: false, mensaje: "'rol_id' es obligatorio." });

    const [usuario, rol] = await Promise.all([
      UsuarioCliente.findByPk(usuario_cliente_id),
      Rol.findByPk(rol_id),
    ]);
    if (!usuario) return res.status(404).json({ ok: false, mensaje: "Usuario no encontrado." });
    if (!rol) return res.status(404).json({ ok: false, mensaje: "Rol no encontrado." });

    const [asignacion, creado] = await ProyectoUsuarioRol.findOrCreate({
      where: { proyecto_id: req.params.id, usuario_cliente_id, rol_id },
      defaults: { nota, activo: true },
    });

    if (!creado) return res.status(409).json({ ok: false, mensaje: "El miembro ya está asignado con ese rol." });

    return res.status(201).json({ ok: true, mensaje: "Miembro agregado.", data: asignacion });
  } catch (err) {
    console.error("[agregarMiembro]", err);
    return res.status(500).json({ ok: false, mensaje: "Error al agregar miembro.", detalle: err.message });
  }
};

export const quitarMiembro = async (req, res) => {
  try {
    const eliminado = await ProyectoUsuarioRol.destroy({
      where: { proyecto_id: req.params.id, usuario_cliente_id: req.params.usuarioClienteId },
    });
    if (!eliminado) return res.status(404).json({ ok: false, mensaje: "Miembro no encontrado en el proyecto." });

    return res.status(200).json({ ok: true, mensaje: "Miembro removido del proyecto." });
  } catch (err) {
    console.error("[quitarMiembro]", err);
    return res.status(500).json({ ok: false, mensaje: "Error al quitar miembro.", detalle: err.message });
  }
};

export const asignarHerramienta = async (req, res) => {
  try {
    const proyecto = await Proyecto.findByPk(req.params.id);
    if (!proyecto) return res.status(404).json({ ok: false, mensaje: "Proyecto no encontrado." });

    const { herramienta_rpa_id, cod_licencia, fecha_asignacion, fecha_expiracion, asignado_por, motivo_cambio } = req.body;
    if (!herramienta_rpa_id) return res.status(400).json({ ok: false, mensaje: "'herramienta_rpa_id' es obligatorio." });
    if (!asignado_por) return res.status(400).json({ ok: false, mensaje: "'asignado_por' (consultor) es obligatorio." });

    const [herramienta, consultor] = await Promise.all([
      HerramientaRpa.findByPk(herramienta_rpa_id),
      Consultor.findByPk(asignado_por),
    ]);
    if (!herramienta) return res.status(404).json({ ok: false, mensaje: "Herramienta no encontrada." });
    if (!consultor) return res.status(404).json({ ok: false, mensaje: "Consultor no encontrado." });

    const asignacion = await AsignacionHerramientas.create({
      proyecto_id: req.params.id,
      herramienta_rpa_id,
      cod_licencia,
      fecha_asignacion: fecha_asignacion || new Date(),
      fecha_expiracion,
      asignado_por,
      motivo_cambio,
      estado: "Activa",
    });

    return res.status(201).json({ ok: true, mensaje: "Herramienta asignada.", data: asignacion });
  } catch (err) {
    console.error("[asignarHerramienta]", err);
    return res.status(500).json({ ok: false, mensaje: "Error al asignar herramienta.", detalle: err.message });
  }
};

export const cambiarEstadoHerramienta = async (req, res) => {
  try {
    const asignacion = await AsignacionHerramientas.findOne({
      where: { id: req.params.asignacionId, proyecto_id: req.params.id },
    });
    if (!asignacion) return res.status(404).json({ ok: false, mensaje: "Asignación no encontrada." });

    const { estado, motivo_cambio } = req.body;
    await asignacion.update({ estado, motivo_cambio });
    return res.status(200).json({ ok: true, mensaje: "Estado actualizado.", data: asignacion });
  } catch (err) {
    console.error("[cambiarEstadoHerramienta]", err);
    return res.status(500).json({ ok: false, mensaje: "Error al actualizar estado.", detalle: err.message });
  }
};