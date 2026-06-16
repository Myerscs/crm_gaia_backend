import axios from "axios";
import { sequelize } from "../config/database.js";
import { Chat, Mensaje, ContextoChat, User } from "../modelos/relations.js";
import { parseAIResponse } from "../utils/jsonUtils.js";
import { buildAIRequestPayload } from "../AI/buildAIRequestPayload.js";
import { AI_PROVIDERS } from "../AI/providers.js";
import { processFiles } from "../utils/fileProcessor.js";
import { getCache, setCache, delCache } from "../utils/cache.js";

const TOKENS_PARA_RESUMIR = 2000;
const MENSAJES_DE_CONTEXTO = 10;
const CHATS_TTL = 60 * 2;
const MENSAJES_TTL = 60 * 5;

const RELEVO_PROVIDERS = ["deepseek", "claude"];

const keyChats = (userId) => `chats:user:${userId}`;
const keyMensajes = (chatId) => `chat:${chatId}:mensajes`;

const getUserDesdeToken = async (req) => {
  return User.findOne({ where: { email: req.user.email } });
};

const llamarIAConProveedor = async (providerKey, mod, data_to_analyze) => {
  const { payload, provider } = buildAIRequestPayload(mod, data_to_analyze, [], providerKey);
  const cfg = AI_PROVIDERS[provider];
  const { data } = await axios.post(cfg.url, payload, {
    headers: cfg.headers,
    timeout: 60000,
  });
  return parseAIResponse(cfg.extractResponse(data));
};

const llamarIA = async (mod, data_to_analyze, providerPrincipal = "deepseek") => {
  const orden = [
    providerPrincipal,
    ...RELEVO_PROVIDERS.filter((p) => p !== providerPrincipal),
  ];

  let lastError = null;

  for (const providerKey of orden) {
    try {
      const result = await llamarIAConProveedor(providerKey, mod, data_to_analyze);
      return { result, providerUsado: providerKey };
    } catch (err) {
      const esErrorDeServidor =
        !err.response ||                         // timeout / sin conexión
        err.response.status === 429 ||           // rate limit
        err.response.status === 500 ||           // error interno proveedor
        err.response.status === 502 ||           // bad gateway
        err.response.status === 503 ||           // servicio no disponible
        err.response.status === 504;             // gateway timeout

      if (esErrorDeServidor) {
        console.warn(
          `[relevo] Proveedor "${providerKey}" falló (${err.response?.status ?? "sin respuesta"}). ` +
          `Intentando con el siguiente...`
        );
        lastError = err;
        continue;
      }
      throw err;
    }
  }
  throw new Error(
    `Todos los proveedores de IA fallaron. Último error: ${lastError?.message}`
  );
};

export const crearChat = async (req, res) => {
  try {
    const { titulo } = req.body;
    const user = await getUserDesdeToken(req);
    if (!user)
      return res.status(404).json({ ok: false, mensaje: "Usuario no encontrado." });

    const chat = await Chat.create({
      user_id: user.id,
      titulo: titulo?.trim() || "Nueva conversación",
    });

    await ContextoChat.create({ chat_id: chat.id });
    await delCache(keyChats(user.id));

    return res.status(201).json({ ok: true, mensaje: "Chat creado.", data: chat });
  } catch (err) {
    console.error("[crearChat]", err.message);
    return res.status(500).json({ ok: false, mensaje: "Error al crear chat.", detalle: err.message });
  }
};

export const listarChats = async (req, res) => {
  try {
    const user = await getUserDesdeToken(req);
    if (!user)
      return res.status(404).json({ ok: false, mensaje: "Usuario no encontrado." });

    const cacheKey = keyChats(user.id);
    const cached = await getCache(cacheKey);
    if (cached)
      return res.status(200).json({ ok: true, data: cached });

    const chats = await Chat.findAll({
      where: { user_id: user.id, activo: true },
      order: [["updatedAt", "DESC"]],
    });

    await setCache(cacheKey, chats, CHATS_TTL);
    return res.status(200).json({ ok: true, data: chats });
  } catch (err) {
    console.error("[listarChats]", err.message);
    return res.status(500).json({ ok: false, mensaje: "Error al listar chats.", detalle: err.message });
  }
};

export const obtenerMensajes = async (req, res) => {
  try {
    const chat = await Chat.findByPk(req.params.chatId);
    if (!chat)
      return res.status(404).json({ ok: false, mensaje: "Chat no encontrado." });

    const cacheKey = keyMensajes(req.params.chatId);
    const cached = await getCache(cacheKey);
    if (cached)
      return res.status(200).json({ ok: true, ...cached });

    const [mensajes, contexto] = await Promise.all([
      Mensaje.findAll({
        where: { chat_id: req.params.chatId },
        order: [["indice_orden", "ASC"]],
      }),
      ContextoChat.findOne({ where: { chat_id: req.params.chatId } }),
    ]);

    await setCache(cacheKey, { data: mensajes, contexto }, MENSAJES_TTL);
    return res.status(200).json({ ok: true, data: mensajes, contexto });
  } catch (err) {
    console.error("[obtenerMensajes]", err.message);
    return res.status(500).json({ ok: false, mensaje: "Error al obtener mensajes.", detalle: err.message });
  }
};

export const eliminarChat = async (req, res) => {
  try {
    const chat = await Chat.findByPk(req.params.chatId);
    if (!chat)
      return res.status(404).json({ ok: false, mensaje: "Chat no encontrado." });

    await chat.update({ activo: false });

    const user = await getUserDesdeToken(req);
    await delCache(keyChats(user?.id), keyMensajes(req.params.chatId));

    return res.status(200).json({ ok: true, mensaje: "Chat desactivado." });
  } catch (err) {
    console.error("[eliminarChat]", err.message);
    return res.status(500).json({ ok: false, mensaje: "Error al eliminar chat.", detalle: err.message });
  }
};

const verificarYRenovarTokens = async (user) => {
  const ahora = new Date();
  let renovado = false;

  if (!user.renovacion_tokens) {
    user.renovacion_tokens = ahora;
    user.tokens = 100;
    renovado = true;
    await user.save();
    return { user, renovado };
  }

  const fechaRenovacion = new Date(user.renovacion_tokens);
  const proximaRenovacion = new Date(fechaRenovacion);
  proximaRenovacion.setMonth(proximaRenovacion.getMonth() + 1);
  proximaRenovacion.setHours(0, 0, 0, 0);

  if (ahora >= proximaRenovacion) {
    user.tokens = 100;
    user.renovacion_tokens = ahora;
    renovado = true;
    await user.save();
  }

  return { user, renovado };
};

// chatController.js – método enviarMensaje completo

export const enviarMensaje = async (req, res) => {
  try {
    const { chatId } = req.params;
    const {
      pregunta,
      provider = "deepseek",
      model = "deepseek-v4-flash",
      currentRoute = "/",
      webSearch = "false",
      allowAttach = "true",
    } = req.body;

    // Validación básica
    if (!pregunta?.trim()) {
      return res.status(400).json({ ok: false, mensaje: "'pregunta' es obligatoria." });
    }

    // 1. Obtener usuario desde el token
    const user = await getUserDesdeToken(req);
    if (!user) {
      return res.status(404).json({ ok: false, mensaje: "Usuario no encontrado." });
    }

    // 2. Verificar que la IA esté activa
    if (!user.ia_activa) {
      return res.status(403).json({
        ok: false,
        codigo: "IA_DESACTIVADA",
        mensaje: "Tu asistente IA está desactivado. Contacta al administrador.",
      });
    }

    // 3. Verificar y renovar tokens si corresponde
    const { user: userActualizado, renovado } = await verificarYRenovarTokens(user);
    if (renovado) {
      console.log(`[TOKENS] Usuario ${userActualizado.email} renovó tokens. Nuevo saldo: ${userActualizado.tokens}`);
    }

    // 4. Validar saldo de tokens
    if (userActualizado.tokens <= 0) {
      return res.status(403).json({
        ok: false,
        codigo: "SIN_TOKENS",
        mensaje: "No tienes tokens disponibles. Espera a la renovación mensual.",
      });
    }

    // 5. Preparar datos del chat
    const isWebSearch = webSearch === "true" || webSearch === true;
    const canAttach = allowAttach === "true" || allowAttach === true;

    const [chat, contexto, mensajesRecientes, totalMensajes] = await Promise.all([
      Chat.findByPk(chatId),
      ContextoChat.findOne({ where: { chat_id: chatId } }),
      Mensaje.findAll({
        where: { chat_id: chatId, rol: ["user", "assistant"] },
        order: [["indice_orden", "DESC"]],
        limit: MENSAJES_DE_CONTEXTO,
      }),
      Mensaje.count({ where: { chat_id: chatId } }),
    ]);

    if (!chat || !chat.activo) {
      return res.status(404).json({ ok: false, mensaje: "Chat no encontrado o inactivo." });
    }

    const historial_reciente = mensajesRecientes.reverse().map((m) => ({
      rol: m.rol,
      contenido: m.contenido,
    }));

    const intencion_pendiente = contexto?.intencion_pendiente || null;

    // 6. Guardar mensaje del usuario (fuera de la transacción principal para evitar bloqueos)
    await Mensaje.create({
      chat_id: chatId,
      rol: "user",
      contenido: pregunta.trim(),
      indice_orden: totalMensajes,
      tokens: null,
    });

    let archivosTexto = [];
    if (canAttach && req.files && req.files.length > 0) {
      archivosTexto = await processFiles(req.files);
    }

    // 7. Llamada a la IA (query y answer)
    let queryResult, answerResult;
    let providerQuery, providerAnswer;

    try {
      const resultQuery = await llamarIA(
        "db_query",
        {
          pregunta,
          historial_reciente,
          intencion_pendiente,
          resumen_contexto: contexto?.resumen || null,
          archivos_contexto: archivosTexto,
          provider,
          model,
          isWebSearch,
        },
        provider
      );
      queryResult = resultQuery.result;
      providerQuery = resultQuery.providerUsado;
    } catch (err) {
      // Si la IA falla, NO se descuenta token
      console.error("[IA] Error en db_query:", err.message);
      return res.status(500).json({
        ok: false,
        mensaje: "Error al procesar la solicitud con la IA.",
        detalle: err.message,
      });
    }

    if (!queryResult.isValid) {
      // Si la IA devuelve error, NO se descuenta token
      console.warn("[IA] db_query inválido:", queryResult.error);
      return res.status(422).json({
        ok: false,
        mensaje: "La IA no pudo procesar la solicitud.",
        detalle: queryResult.error,
      });
    }

    const { queryValida, razon, query } = queryResult.parsed;

    let resultados = [];
    let total_filas = 0;
    let errorEjecucion = null;

    if (queryValida && query) {
      try {
        const rows = await sequelize.query(query, { type: sequelize.QueryTypes.SELECT });
        resultados = rows;
        total_filas = rows.length;
      } catch (sqlErr) {
        console.error("[SQL] Error ejecutando query:", sqlErr.message);
        errorEjecucion = sqlErr.message;
      }
    }

    const tokensAcumulados = (contexto?.tokens_acumulados || 0) + pregunta.length;
    const debeResumir = tokensAcumulados > TOKENS_PARA_RESUMIR;

    try {
      const resultAnswer = await llamarIA(
        "db_answer",
        {
          pregunta_original: pregunta,
          current_route: currentRoute,
          razon_query: razon,
          query_valida: queryValida && !errorEjecucion,
          resultados: resultados.slice(0, 50),
          total_filas,
          archivos_contexto: archivosTexto,
          historial_reciente,
          intencion_pendiente,
          generar_resumen: debeResumir,
          resumen_anterior: contexto?.resumen || null,
          provider,
          model,
          isWebSearch,
        },
        provider
      );
      answerResult = resultAnswer.result;
      providerAnswer = resultAnswer.providerUsado;
    } catch (err) {
      // Si falla db_answer, NO se descuenta token
      console.error("[IA] Error en db_answer:", err.message);
      return res.status(500).json({
        ok: false,
        mensaje: "Error al formatear la respuesta.",
        detalle: err.message,
      });
    }

    if (!answerResult.isValid) {
      console.warn("[IA] db_answer inválido:", answerResult.error);
      return res.status(422).json({
        ok: false,
        mensaje: "Error al formatear la respuesta.",
        detalle: answerResult.error,
      });
    }

    const {
      respuesta,
      tiene_datos,
      sugerencias,
      actions = [],
      intencion_pendiente: nuevaIntencion = null,
      resumen: resumenNuevo = null,
    } = answerResult.parsed;

    const resumenFinal = resumenNuevo || contexto?.resumen || null;

    // 8. Transacción para guardar mensaje assistant, actualizar contexto y DESCONTAR TOKEN
    const t = await sequelize.transaction();
    try {
      const totalTras = totalMensajes + 1;

      // Guardar mensaje del asistente
      await Mensaje.create(
        {
          chat_id: chatId,
          rol: "assistant",
          contenido: respuesta,
          indice_orden: totalTras,
          tokens: null,
        },
        { transaction: t }
      );

      // Actualizar contexto
      const contextoUpdate = { intencion_pendiente: nuevaIntencion };
      if (debeResumir) {
        contextoUpdate.resumen = resumenFinal;
        contextoUpdate.mensajes_resumidos = totalTras + 1;
        contextoUpdate.tokens_acumulados = 0;
      } else {
        contextoUpdate.tokens_acumulados = tokensAcumulados + respuesta.length;
      }
      await contexto.update(contextoUpdate, { transaction: t });

      // Si es el primer mensaje, actualizar título del chat
      if (totalMensajes === 0) {
        await chat.update({ titulo: pregunta.trim().slice(0, 80) }, { transaction: t });
      }

      // 9. Descontar 1 token (solo si todo lo anterior fue exitoso)
      userActualizado.tokens -= 1;
      await userActualizado.save({ transaction: t });

      await t.commit();
      console.log(`[TOKENS] Usuario ${userActualizado.email} consumió 1 token. Saldo restante: ${userActualizado.tokens}`);

    } catch (writeErr) {
      await t.rollback();
      console.error("[TOKENS] Error en transacción, rollback. No se descontó token.", writeErr);
      throw writeErr; // Re-lanzar para que lo capture el catch exterior
    }

    // 10. Invalidar cachés
    await delCache(keyMensajes(chatId));
    if (totalMensajes === 0) {
      const user = await getUserDesdeToken(req);
      await delCache(keyChats(user?.id));
    }

    // 11. Construir respuesta
    const huboRelevo = providerQuery !== provider || providerAnswer !== provider;

    const tokens_ia = {
      limite: 100,
      usados: 100 - userActualizado.tokens,
      disponibles: userActualizado.tokens,
      renovacion: userActualizado.renovacion_tokens, // fecha base (última renovación)
    };

    const CONTEXTO = {
      resumen: resumenFinal,
      intencion_pendiente: nuevaIntencion,
      mensajes_resumidos: contexto?.mensajes_resumidos ?? 0,
      tokens_acumulados: debeResumir ? 0 : tokensAcumulados + respuesta.length,
    };

    const debug = {
      query_generada: query || null,
      total_filas,
      error_sql: errorEjecucion,
      web_search_enabled: isWebSearch,
      attach_enabled: canAttach,
      provider_solicitado: provider,
      provider_query: providerQuery,
      provider_answer: providerAnswer,
      relevo_activado: huboRelevo,
    };

    return res.status(200).json({
      ok: true,
      respuesta,
      tiene_datos,
      sugerencias,
      actions,
      tokens_ia,
      contexto: CONTEXTO,
      debug,
    });

  } catch (err) {
    console.error("[enviarMensaje] Error general:", err.message);
    return res.status(500).json({
      ok: false,
      mensaje: "Error en el flujo de chat.",
      detalle: err.message,
    });
  }
};
