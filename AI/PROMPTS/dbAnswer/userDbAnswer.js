export const userDbAnswer = (data_to_analyze) => {
  const {
    pregunta_original,
    razon_query,
    query_valida,
    resultados,
    total_filas,
    archivos_contexto    = [],
    generar_resumen      = false,
    resumen_anterior     = null,
    historial_reciente   = [],
    intencion_pendiente  = null,
  } = data_to_analyze;

  const partes = [];

  if (historial_reciente.length > 0) {
    const historialTexto = historial_reciente
      .map((m) => `[${m.rol === "user" ? "Usuario" : "Asistente"}]: ${m.contenido}`)
      .join("\n");
    partes.push(`CONVERSACIÓN PREVIA:\n${historialTexto}`);
  }

  if (intencion_pendiente) {
    partes.push(`INTENCIÓN PENDIENTE DEL TURNO ANTERIOR:\n${intencion_pendiente}`);
  }

  // ── Resultado de la query ────────────────────────────────
  if (!query_valida) {
    partes.push(
      `PREGUNTA DEL USUARIO: "${pregunta_original}"\n\n` +
      `La solicitud no pudo traducirse a una consulta válida.\n` +
      `Motivo / datos faltantes: ${razon_query}`
    );
    if (archivos_contexto.length > 0) {
      partes.push(
        `NOTA: El usuario adjuntó ${archivos_contexto.length} archivo(s). ` +
        `Si contienen información útil para responder directamente, úsalos.`
      );
    }
    partes.push(
      `Redacta una respuesta amigable:\n` +
      `- Si faltan datos: pídelos de forma clara y específica, listando exactamente cuáles necesitas.\n` +
      `- Si es una limitación del sistema: explícala sin términos técnicos.\n` +
      `- Mantén coherencia con la conversación previa.`
    );
  } else {
    const resumenResultados =
      total_filas === 0
        ? "La consulta no retornó ningún registro."
        : `La consulta retornó ${total_filas} registro(s).\n\nDATOS:\n${JSON.stringify(resultados, null, 2)}`;

    partes.push(
      `PREGUNTA DEL USUARIO: "${pregunta_original}"\n` +
      `La consulta buscaba: ${razon_query}\n\n` +
      `${resumenResultados}`
    );
    if (archivos_contexto.length > 0) {
      partes.push(
        `NOTA: El usuario adjuntó ${archivos_contexto.length} archivo(s). ` +
        `Si la respuesta usa datos del archivo, menciónalo brevemente.`
      );
    }
    partes.push(`Redacta una respuesta clara, inteligente y coherente con la conversación previa.`);
  }

  if (generar_resumen) {
    const anteriorTexto = resumen_anterior
      ? `RESUMEN ANTERIOR (amplía o actualiza):\n${resumen_anterior}\n`
      : "";
    partes.push(
      `\nADEMÁS, en el campo "resumen" del JSON genera un resumen ejecutivo de la conversación completa.\n` +
      `${anteriorTexto}` +
      `El resumen debe capturar: temas tratados, datos ya recopilados, intenciones expresadas, resultados obtenidos y compromisos pendientes. ` +
      `Máximo 5 oraciones. Escrito para que una IA que retome la conversación entienda exactamente dónde está.`
    );
  }

  return partes.join("\n\n");
};