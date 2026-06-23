import { Op }           from "sequelize";
import { Area, Rol, HerramientaRpa } from "../modelos/relations.js";
import { getCache, setCache, delPattern } from "../utils/cache.js";

const crudMaestro = (Modelo, nombreEntidad, campoBusqueda = "nombre") => ({

  listar: async (req, res) => {
    try {
      const { activo, search, page = 1, limit = 50 } = req.query;

      const where = {};
      if (activo !== undefined) where.activo = activo === "true";
      if (search) where[campoBusqueda] = { [Op.iLike]: `%${search.trim()}%` };

      const offset = (Math.max(1, +page) - 1) * +limit;
      const { count, rows } = await Modelo.findAndCountAll({
        where, order: [[campoBusqueda, "ASC"]], limit: +limit, offset,
      });

      const result = { ok: true, total: count, page: +page, pages: Math.ceil(count / +limit), data: rows };
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).json({ ok: false, mensaje: `Error al listar ${nombreEntidad}.`, detalle: err.message });
    }
  },

  crear: async (req, res) => {
    try {
      const { nombre, descripcion, ...extra } = req.body;
      if (!nombre?.trim()) return res.status(400).json({ ok: false, mensaje: "'nombre' es obligatorio." });
      const existe = await Modelo.findOne({ where: { nombre: nombre.trim() } });
      if (existe) return res.status(409).json({ ok: false, mensaje: `Ya existe ${nombreEntidad} con ese nombre.` });
      const registro = await Modelo.create({ nombre: nombre.trim(), descripcion, ...extra });
      return res.status(201).json({ ok: true, mensaje: `${nombreEntidad} creada.`, data: registro });
    } catch (err) {
      return res.status(500).json({ ok: false, mensaje: `Error al crear ${nombreEntidad}.`, detalle: err.message });
    }
  },

  actualizar: async (req, res) => {
    try {
      const registro = await Modelo.findByPk(req.params.id);
      if (!registro) return res.status(404).json({ ok: false, mensaje: `${nombreEntidad} no encontrada.` });
      const { nombre, descripcion, activo, ...extra } = req.body;
      if (nombre && nombre.trim() !== registro.nombre) {
        const dup = await Modelo.findOne({ where: { nombre: nombre.trim() } });
        if (dup) return res.status(409).json({ ok: false, mensaje: "Nombre ya en uso." });
      }
      await registro.update({ nombre, descripcion, activo, ...extra });
      return res.status(200).json({ ok: true, mensaje: `${nombreEntidad} actualizada.`, data: registro });
    } catch (err) {
      return res.status(500).json({ ok: false, mensaje: `Error al actualizar ${nombreEntidad}.`, detalle: err.message });
    }
  },

  eliminar: async (req, res) => {
    try {
      const registro = await Modelo.findByPk(req.params.id);
      if (!registro) return res.status(404).json({ ok: false, mensaje: `${nombreEntidad} no encontrada.` });
      if ("activo" in registro.dataValues) {
        await registro.update({ activo: false });
        return res.status(200).json({ ok: true, mensaje: `${nombreEntidad} desactivada.` });
      }
      await registro.destroy();
      return res.status(200).json({ ok: true, mensaje: `${nombreEntidad} eliminada.` });
    } catch (err) {
      return res.status(500).json({ ok: false, mensaje: `Error al eliminar ${nombreEntidad}.`, detalle: err.message });
    }
  },

  obtener: async (req, res) => {
    try {
      const registro = await Modelo.findByPk(req.params.id);
      if (!registro) return res.status(404).json({ ok: false, mensaje: `${nombreEntidad} no encontrada.` });
      return res.status(200).json({ ok: true, data: registro });
    } catch (err) {
      return res.status(500).json({ ok: false, mensaje: `Error al obtener ${nombreEntidad}.`, detalle: err.message });
    }
  },
});

const areaCrud        = crudMaestro(Area,          "Área");
const rolCrud         = crudMaestro(Rol,           "Rol");
const herramientaCrud = crudMaestro(HerramientaRpa,"Herramienta");


export const listarAreas        = areaCrud.listar;
export const obtenerArea        = areaCrud.obtener;
export const crearArea          = areaCrud.crear;
export const actualizarArea     = areaCrud.actualizar;
export const eliminarArea       = areaCrud.eliminar;


export const listarRoles        = rolCrud.listar;
export const obtenerRol         = rolCrud.obtener;
export const crearRol           = rolCrud.crear;
export const actualizarRol      = rolCrud.actualizar;
export const eliminarRol        = rolCrud.eliminar;


export const listarHerramientas = herramientaCrud.listar;
export const obtenerHerramienta = herramientaCrud.obtener;


export const crearHerramienta = async (req, res) => {
  try {
    const { nombre, descripcion, fabricante, version } = req.body;
    if (!nombre?.trim()) return res.status(400).json({ ok: false, mensaje: "'nombre' es obligatorio." });

    const existe = await HerramientaRpa.findOne({ where: { nombre: nombre.trim() } });
    if (existe) return res.status(409).json({ ok: false, mensaje: "Ya existe una herramienta con ese nombre." });

    const herramienta = await HerramientaRpa.create({
      nombre: nombre.trim(), fabricante,
    });
    return res.status(201).json({ ok: true, mensaje: "Herramienta creada.", data: herramienta });
  } catch (err) {
    console.error("[crearHerramienta]", err);
    return res.status(500).json({ ok: false, mensaje: "Error al crear herramienta.", detalle: err.message });
  }
};

export const actualizarHerramienta = async (req, res) => {
  try {
    const herramienta = await HerramientaRpa.findByPk(req.params.id);
    if (!herramienta) return res.status(404).json({ ok: false, mensaje: "Herramienta no encontrada." });

    const { nombre, fabricante, activo } = req.body;

    if (nombre && nombre.trim() !== herramienta.nombre) {
      const dup = await HerramientaRpa.findOne({ where: { nombre: nombre.trim() } });
      if (dup) return res.status(409).json({ ok: false, mensaje: "Nombre ya en uso." });
    }

    await herramienta.update({ nombre, fabricante, activo });
    return res.status(200).json({ ok: true, mensaje: "Herramienta actualizada.", data: herramienta });
  } catch (err) {
    console.error("[actualizarHerramienta]", err);
    return res.status(500).json({ ok: false, mensaje: "Error al actualizar herramienta.", detalle: err.message });
  }
};

export const eliminarHerramienta = herramientaCrud.eliminar;