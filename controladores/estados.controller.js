import { Estados } from "../modelos/relations.js";
import { getCache, setCache, delCache } from "../utils/cache.js";

const KEY = "estados:activos";

export const listar = async (req, res) => {
  try {
    const cached = await getCache(KEY);
    if (cached) return res.json({ ok: true, data: cached, cached: true });

    const estados = await Estados.findAll({ where: { activo: true }, order: [["nombre", "ASC"]] });
    await setCache(KEY, estados, 60 * 24 * 7);  
    res.json({ ok: true, data: estados });
  } catch (err) {
    res.status(500).json({ ok: false, mensaje: err.message });
  }
};

export const crear = async (req, res) => {
  try {
    const { nombre } = req.body;
    if (!nombre?.trim()) return res.status(400).json({ ok: false, mensaje: "'nombre' es requerido" });
    const estado = await Estados.create({ nombre: nombre.trim() });
    await delCache(KEY);
    res.status(201).json({ ok: true, data: estado });
  } catch (err) {
    res.status(500).json({ ok: false, mensaje: err.message });
  }
};

export const actualizar = async (req, res) => {
  try {
    const estado = await Estados.findByPk(req.params.id);
    if (!estado) return res.status(404).json({ ok: false, mensaje: "Estado no encontrado" });
    await estado.update(req.body);
    await delCache(KEY);
    res.json({ ok: true, data: estado });
  } catch (err) {
    res.status(500).json({ ok: false, mensaje: err.message });
  }
};

export const eliminar = async (req, res) => {
  try {
    const estado = await Estados.findByPk(req.params.id);
    if (!estado) return res.status(404).json({ ok: false, mensaje: "Estado no encontrado" });
    await estado.update({ activo: false });
    await delCache(KEY);
    res.json({ ok: true, mensaje: "Estado desactivado" });
  } catch (err) {
    res.status(500).json({ ok: false, mensaje: err.message });
  }
};