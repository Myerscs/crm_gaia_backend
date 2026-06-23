export const userDbQuery = (data_to_analyze) => {
  const {
    pregunta,
    historial_reciente   = [],
    archivos_contexto    = [],
    intencion_pendiente  = null,   
  } = data_to_analyze;

  const partes = [];

  if (historial_reciente.length > 0) {
    const historialTexto = historial_reciente
      .map((m) => `[${m.rol === "user" ? "Usuario" : "Asistente"}]: ${m.contenido}`)
      .join("\n");
    partes.push(`CONVERSACIÓN PREVIA (usa esto para entender el contexto y la intención acumulada):\n${historialTexto}`);
  }

  if (intencion_pendiente) {
    partes.push(
      `INTENCIÓN PENDIENTE DETECTADA EN TURNO ANTERIOR:\n${intencion_pendiente}\n` +
      `Si el mensaje actual del usuario parece proveer datos para completar esa intención, trátalo como continuación de la misma acción y construye la query correspondiente.`
    );
  }

  if (archivos_contexto.length > 0) {
    partes.push(
      `ARCHIVOS ADJUNTOS (úsalos para construir filtros o valores en la query):\n${archivos_contexto.join("\n\n")}`
    );
  }

  partes.push(`MENSAJE ACTUAL DEL USUARIO:\n${pregunta}`);

  partes.push(
    `INSTRUCCIÓN DE COHERENCIA:
- Si el mensaje actual es solo datos (nombre, email, fechas, números) sin verbo de acción explícito,
  infiere la acción desde la CONVERSACIÓN PREVIA o la INTENCIÓN PENDIENTE.
- Si en turnos anteriores el asistente pidió datos para completar una operación,
  el mensaje actual probablemente provee esos datos → construye la query correspondiente.
- Si aún faltan datos obligatorios para ejecutar la acción, devuelve queryValida: false
  y en "razon" lista exactamente qué campos faltan todavía.
- Si la intención implica INSERT/UPDATE pero el schema solo permite SELECT,
  devuelve queryValida: false con razon: "operación de escritura — debe manejarse por endpoint dedicado"
  e incluye en "razon" los datos recopilados hasta ahora para que el siguiente paso los use.
- Si el usuario quiere enviar un archivo , preguntar por el consultor a enviar (si no está claro), asunto , mensaje, etc .Y conforme el usuario provea datos, los acumule en intencion_pendiente.`
  );

  return partes.join("\n\n");
};