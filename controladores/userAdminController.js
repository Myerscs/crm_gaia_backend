import { Op } from "sequelize";
import { User } from "../modelos/relations.js";

export const getUsers = async (req, res) => {
  try {
    const { search = "", page = 1, limit = 10, ia_activa } = req.query;
    const offset = (page - 1) * limit;

    const where = {
      rol: { [Op.ne]: "admin" },
      ...(search && {
        [Op.or]: [
          { nombre: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } },
        ],
      }),
      ...(ia_activa !== undefined && { ia_activa: ia_activa === "true" }),
    };

    const { count, rows } = await User.findAndCountAll({
      where,
      attributes: { exclude: ["password", "token_verificacion", "google_token"] },
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset,
    });

    res.json({
      ok: true,
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: "Error al obtener usuarios", error: error.message });
  }
};

export const updateIaActiva = async (req, res) => {
  try {
    const { id } = req.params;
    const { ia_activa } = req.body;

    if (typeof ia_activa !== "boolean") {
      return res.status(400).json({ ok: false, mensaje: "El campo ia_activa debe ser booleano" });
    }

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ ok: false, mensaje: "Usuario no encontrado" });
    if (user.rol === "admin") return res.status(403).json({ ok: false, mensaje: "No puedes modificar a un administrador" });

    await user.update({ ia_activa });
    res.json({ ok: true, mensaje: `IA ${ia_activa ? "activada" : "desactivada"} correctamente`, data: user });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: "Error al actualizar IA", error: error.message });
  }
};

const calcularProximaRenovacion = () => {
  const proxima = new Date();
  proxima.setMonth(proxima.getMonth() + 1);
  proxima.setHours(0, 0, 0, 0);
  return proxima;
};

export const renovarTokens = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ ok: false, mensaje: "Usuario no encontrado" });
    if (user.rol === "admin") return res.status(403).json({ ok: false, mensaje: "Los administradores no necesitan renovación" });

    const proximaRenovacion = calcularProximaRenovacion();

    await user.update({
      tokens: 100,
      renovacion_tokens: proximaRenovacion,
    });

    await user.reload();

    res.json({
      ok: true,
      mensaje: "Tokens renovados exitosamente",
      data: {
        tokens: user.tokens,
        renovacion_tokens: user.renovacion_tokens,
      },
    });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: "Error al renovar tokens", error: error.message });
  }
};

export const addTokens = async (req, res) => {
  try {
    const { id } = req.params;
    const { cantidad } = req.body;

    if (!Number.isInteger(cantidad) || cantidad <= 0) {
      return res.status(400).json({ ok: false, mensaje: "La cantidad debe ser un entero positivo" });
    }

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ ok: false, mensaje: "Usuario no encontrado" });
    if (user.rol === "admin") return res.status(403).json({ ok: false, mensaje: "Los administradores no usan tokens" });

    await user.increment("tokens", { by: cantidad });
    await user.reload();

    res.json({
      ok: true,
      mensaje: `Se agregaron ${cantidad} tokens correctamente`,
      data: {
        tokens: user.tokens,
        renovacion_tokens: user.renovacion_tokens,
      },
    });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: "Error al agregar tokens", error: error.message });
  }
};

export const removeTokens = async (req, res) => {
  try {
    const { id } = req.params;
    const { cantidad } = req.body;

    if (!Number.isInteger(cantidad) || cantidad <= 0) {
      return res.status(400).json({ ok: false, mensaje: "La cantidad debe ser un entero positivo" });
    }

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ ok: false, mensaje: "Usuario no encontrado" });
    if (user.rol === "admin") return res.status(403).json({ ok: false, mensaje: "Los administradores no usan tokens" });

    if (user.tokens < cantidad) {
      return res.status(400).json({ ok: false, mensaje: `Saldo insuficiente (tokens actuales: ${user.tokens})` });
    }

    await user.decrement("tokens", { by: cantidad });
    await user.reload();

    res.json({
      ok: true,
      mensaje: `Se quitaron ${cantidad} tokens correctamente`,
      data: {
        tokens: user.tokens,
        renovacion_tokens: user.renovacion_tokens,
      },
    });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: "Error al quitar tokens", error: error.message });
  }
};