import { redis } from "../config/redis.js";

const DEFAULT_TTL = 60 * 5;

export const getCache = async (key) => {
  try {
    const val = await redis.get(key);
    return val ? JSON.parse(val) : null;
  } catch { return null; } 
};

export const setCache = async (key, data, ttl = DEFAULT_TTL) => {
  try {
    await redis.set(key, JSON.stringify(data), { EX: ttl });
  } catch { }
};

export const delCache = async (...keys) => {
  try {
    if (keys.length) await redis.del(keys);
  } catch { }
};

export const delPattern = async (pattern) => {
  const keys = await redis.keys(pattern);
  if (keys.length) await redis.del(keys);
};

export const invalidarCacheClientes = async () => {
  await delCache("clientes:resumen");
};

export const invalidarCacheProyectos = async (clienteId) => {
  await delCache(
    "clientes:resumen",
    `cliente:${clienteId}:proyectos`,
  );
};

export const invalidarCacheProcesos = async (proyectoId, clienteId) => {
  const keys = [`proyecto:${proyectoId}:procesos`, "clientes:resumen"];
  if (clienteId) keys.push(`cliente:${clienteId}:proyectos`);
  await delCache(...keys);
};

export const invalidarCacheProcesosPattern = async (proyectoId) => {
  await delPattern(`proyecto:${proyectoId}:*`);
  await delCache("clientes:resumen");
};