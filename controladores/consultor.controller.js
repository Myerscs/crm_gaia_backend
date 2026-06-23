import { Op } from "sequelize";
import { Consultor } from "../modelos/relations.js";
import { emailValido } from "../utils/verifyEmail.js";
import User from "../modelos/User.js";
import CryptoJS from "crypto-js";
import crypto from "crypto";
import { sendVerificationEmail } from "../services/email/index.js";
import { encrypt } from "../utils/encrypt.js";
import { getCache, setCache, delPattern } from "../utils/cache.js";

export const listarConsultores = async (req, res) => {
  try {
    const { activo, rol, search, page = 1, limit = 20 } = req.query;
    const cacheKey = `consultores:${activo ?? "all"}:${rol ?? ""}:${search ?? ""}:${page}:${limit}`;

    const cached = await getCache(cacheKey);
    if (cached) return res.status(200).json({ ...cached, cached: true });

    const where = {};
    if (activo !== undefined) where.activo = activo === "true";
    if (rol)    where.rol    = rol;
    if (search) where.nombre = { [Op.like]: `%${search.trim()}%` };

    const offset = (Math.max(1, +page) - 1) * +limit;
    const { count, rows } = await Consultor.findAndCountAll({
      where, order: [["nombre", "ASC"]], limit: +limit, offset,
    });

    const result = { ok: true, total: count, page: +page, pages: Math.ceil(count / +limit), data: rows };
    await setCache(cacheKey, result, 60 * 3);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ ok: false, mensaje: "Error al listar consultores.", detalle: err.message });
  }
};


export const obtenerConsultor = async (req, res) => {
  try {
    const consultor = await Consultor.findByPk(req.params.id);
    if (!consultor) return res.status(404).json({ ok: false, mensaje: "Consultor no encontrado." });
    return res.status(200).json({ ok: true, data: consultor });
  } catch (err) {
    console.error("[obtenerConsultor]", err);
    return res.status(500).json({ ok: false, mensaje: "Error al obtener consultor.", detalle: err.message });
  }
};

export const crearConsultor = async (req, res) => {
  try {
    const { nombre, email, rol = '', telefono, fecha_ingreso,vistas=[] } = req.body;

    if (!nombre?.trim()) return res.status(400).json({ ok: false, mensaje: "'nombre' es obligatorio." });
    if (!email?.trim()) return res.status(400).json({ ok: false, mensaje: "'email' es obligatorio." });
    if (!emailValido(email)) return res.status(400).json({ ok: false, mensaje: "Email inválido." });

    const [existeConsultor, existeUser] = await Promise.all([
      Consultor.findOne({ where: { email: email.trim() } }),
      User.findOne({ where: { email: email.trim() } }),
    ]);
    if (existeConsultor) return res.status(409).json({ ok: false, mensaje: "Ya existe un consultor con ese email." });
    if (existeUser) return res.status(409).json({ ok: false, mensaje: "Ya existe un usuario con ese email." });
    if (fecha_ingreso && fecha_ingreso > new Date().toISOString().slice(0, 10)) {
      return res.status(400).json({ ok: false, mensaje: "La fecha de ingreso no puede ser futura." });
    }
    const passwordPlano = crypto.randomBytes(8).toString("hex");
    const passwordHash = encrypt(passwordPlano);
    const token = crypto.randomBytes(32).toString("hex");

    const [consultor] = await Promise.all([
      Consultor.create({
        nombre: nombre.trim(),
        email: email.trim(),
        rol,
        telefono,
        fecha_ingreso: fecha_ingreso ?? null,
        vistas,
      }),
      User.create({
        nombre: nombre.trim(),
        email: email.trim(),
        password: passwordHash,
        rol,
        verificado: false,
        activo: true,
        token_verificacion: token,
      }),
    ]);

    await sendVerificationEmail(email.trim(), nombre.trim(), token, passwordPlano);

    return res.status(201).json({
      ok: true,
      mensaje: "Consultor creado. Credenciales enviadas por email.",
      data: consultor,
    });
  } catch (err) {
    console.error("[crearConsultor]", err);
    return res.status(500).json({ ok: false, mensaje: "Error al crear consultor.", detalle: err.message });
  } finally {
    await delPattern("consultores:*");
  }
};

export const actualizarConsultor = async (req, res) => {
  try {
    const consultor = await Consultor.findByPk(req.params.id);
    if (!consultor) return res.status(404).json({ ok: false, mensaje: "Consultor no encontrado." });

    const { nombre, email, rol, telefono, activo, fecha_ingreso , vistas=[] } = req.body;

    if (email && email !== consultor.email) {
      if (!emailValido(email)) return res.status(400).json({ ok: false, mensaje: "Email inválido." });
      const dup = await Consultor.findOne({ where: { email } });
      if (dup) return res.status(409).json({ ok: false, mensaje: "Email ya en uso." });
    }
    if (fecha_ingreso && fecha_ingreso > new Date().toISOString().slice(0, 10)) {
      return res.status(400).json({ ok: false, mensaje: "La fecha de ingreso no puede ser futura." });
    }
    if (!Array.isArray(vistas)) {
      return res.status(400).json({ ok: false, mensaje: "Estructura 'vistas' inválida." });
    }
    await Promise.all([
      consultor.update({
        nombre,
        email,
        rol,
        telefono,
        activo,
        fecha_ingreso: fecha_ingreso !== undefined ? fecha_ingreso ?? null : consultor.fecha_ingreso,
        vistas: vistas !== undefined ? vistas : consultor.vistas,
      }),
      User.update(
        { nombre, email, rol, activo },
        { where: { email: consultor.email } }
      ),
    ]);

    return res.status(200).json({ ok: true, mensaje: "Consultor actualizado.", data: consultor });
  } catch (err) {
    console.error("[actualizarConsultor]", err);
    return res.status(500).json({ ok: false, mensaje: "Error al actualizar consultor.", detalle: err.message });
  } finally {
    await delPattern("consultores:*");
  }
};

export const eliminarConsultor = async (req, res) => {
  try {
    const consultor = await Consultor.findByPk(req.params.id);
    if (!consultor) return res.status(404).json({ ok: false, mensaje: "Consultor no encontrado." });

    await Promise.all([
      consultor.update({ activo: false }),
      User.update({ activo: false }, { where: { email: consultor.email } }),
    ]);

    return res.status(200).json({ ok: true, mensaje: "Consultor desactivado." });
  } catch (err) {
    console.error("[eliminarConsultor]", err);
    return res.status(500).json({ ok: false, mensaje: "Error al eliminar consultor.", detalle: err.message });
  } finally {
    await delPattern("consultores:*");
  }
};