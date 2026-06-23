import User      from "../modelos/User.js";
import { Consultor } from "../modelos/Consultor.js";
import jwt       from "jsonwebtoken";
import { encrypt } from "../utils/encrypt.js";
import { decrypt } from "../utils/decrypt.js";
import { JWT_SECRET } from "../config/config.js";

const parseVistas = (v) => {
  if (!v) return [];
  if (Array.isArray(v)) return v;
  try { const p = JSON.parse(v); return Array.isArray(p) ? p : []; }
  catch { return []; }
};

const verificarYRenovarEnLogin = async (user) => {
  const ahora = new Date();
  const fechaRenovacion = new Date(user.renovacion_tokens);

  if (ahora >= fechaRenovacion) {
    const proximaRenovacion = new Date(ahora);
    proximaRenovacion.setMonth(proximaRenovacion.getMonth() + 1);
    proximaRenovacion.setHours(0, 0, 0, 0);

    await user.update({
      tokens: 100,
      renovacion_tokens: proximaRenovacion,
    });
    await user.reload();
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    if (decrypt(user.password) !== password)
      return res.status(401).json({ message: "Contraseña incorrecta" });
    if (!user.verificado) return res.status(403).json({ message: "Cuenta no verificada. Revisa tu correo." });
    if (!user.activo) return res.status(403).json({ message: "Tu cuenta está desactivada. Contacta al administrador." });

    if (user.rol?.toLowerCase() !== "admin") {
      await verificarYRenovarEnLogin(user);
    }

    const esAdmin = user.rol?.toLowerCase() === "admin";
    let vistas = [];
    if (!esAdmin) {
      const consultor = await Consultor.findOne({ where: { email: user.email } });
      vistas = parseVistas(consultor?.vistas);
    }

    const payload = { id: user.id, rol: user.rol, email: user.email, vistas };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "8h" });

    const userOut = {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol,
      verificado: user.verificado,
      activo: user.activo,
      vistas,
      tokens: user.tokens,
      renovacion_tokens: user.renovacion_tokens,
    };

    res.json({ token, user: userOut });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const registrarse = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;
    const user = await User.create({
      nombre,
      email,
      password: encrypt(password),
      rol,
    });
    res.json({ message: "Usuario creado", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const me = async (req, res) => {
  const user = await User.findByPk(req.user.id);
  res.json({
    ...user.toJSON(),
    tokens: user.tokens,
    renovacion_tokens: user.renovacion_tokens,
  });
};

export const changePass = async (req, res) => {
  try {
    const { passwordActual, passwordNueva } = req.body;

    if (!passwordActual || !passwordNueva)
      return res.status(400).json({ message: "Faltan campos requeridos" });

    if (passwordNueva.length < 6)
      return res.status(400).json({ message: "La nueva contraseña debe tener al menos 6 caracteres" });

    const user = await User.findByPk(req.user.id);
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    if (decrypt(user.password) !== passwordActual)
      return res.status(401).json({ message: "La contraseña actual no es correcta" });

    if (passwordActual === passwordNueva)
      return res.status(400).json({ message: "La nueva contraseña no puede ser igual a la actual" });

    await user.update({ password: encrypt(passwordNueva) });

    res.json({ ok: true, mensaje: "Contraseña actualizada correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};