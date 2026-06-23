import { INCLUDE_PROCESO, INCLUDE_PROCESO_LIST, TIPOS_INTERACCION } from "../Helpers/h_proceso.js";
import {
  Proceso,
  Proyecto,
  HerramientaRpa,
  Consultor,
  EtapaLevantamiento,
  EtapaEstimacion,
  EtapaPropuesta,
  EtapaPreliminar,
  EtapaAprobacion,
  EtapaEjecucion,
  Interaccion,
  InteraccionEstimacion,
  InteraccionLevantamiento,
  Estados,
  InteraccionPropuesta,
  InteraccionAprobacion,
  EtapaAprobado,
  InteraccionAprobado,
  EtapaCierre,
  InteraccionCierre,
  InteraccionFacturado,
  EtapaFacturado,
  EtapaRechazado,
  InteraccionRechazado,
  EtapaStandBy,
  InteraccionStandBy,
  InteraccionEjecucion,
  EtapaFacturadoItem,
} from "../modelos/relations.js";
import { getEstadoId, resolverEstadoId } from "../Helpers/h_estados.js";

const TIPOS_CLASIFICACION = ["Proyecto Nuevo", "Solicitud de Cambio"];

export const listarProcesos = async (req, res) => {
  try {
    const { proyectoId, estatus, tipo, page = 1, limit = 20 } = req.query;
    const proyectoIdParam = req.params.proyectoId || proyectoId;

    const where = {};
    if (proyectoIdParam) where.proyecto_id = proyectoIdParam;
    if (tipo) where.tipo = tipo;

    const offset = (Math.max(1, +page) - 1) * +limit;
    const count = await Proceso.count({ where });

    const rows = await Proceso.findAll({
      where,
      include: INCLUDE_PROCESO_LIST,
      order: [["createdAt", "DESC"]],
      limit: +limit,
      offset,
    });

    return res.status(200).json({
      ok: true, total: count, page: +page,
      pages: Math.ceil(count / +limit), data: rows,
    });
  } catch (err) {
    console.error("[listarProcesos]", err);
    return res.status(500).json({ ok: false, mensaje: "Error al listar procesos.", detalle: err.message });
  }
};

export const obtenerProceso = async (req, res) => {
  try {
    const proceso = await Proceso.findByPk(req.params.id, { include: INCLUDE_PROCESO });
    if (!proceso) return res.status(404).json({ ok: false, mensaje: "Proceso no encontrado." });
    return res.status(200).json({ ok: true, data: proceso });
  } catch (err) {
    console.error("[obtenerProceso]", err);
    return res.status(500).json({ ok: false, mensaje: "Error al obtener proceso.", detalle: err.message });
  }
};

export const crearProceso = async (req, res) => {
  try {
    const { proyectoId } = req.params;
    const {
      tipo,
      estatus = "Creación",
      prioridad,
      herramientas_ids = [],
    } = req.body;
    
    if (tipo && !TIPOS_CLASIFICACION.includes(tipo))
      return res.status(400).json({ ok: false, mensaje: `'tipo' inválido. Válidos: ${TIPOS_CLASIFICACION.join(", ")}.` });
    
    const proyecto = await Proyecto.findByPk(proyectoId);
    if (!proyecto) return res.status(404).json({ ok: false, mensaje: "Proyecto no encontrado." });

    if (herramientas_ids.length > 0) {
      const encontradas = await HerramientaRpa.findAll({ where: { id: herramientas_ids } });
      if (encontradas.length !== herramientas_ids.length)
        return res.status(404).json({ ok: false, mensaje: "Una o más herramientas no encontradas." });
    }

    const proceso = await Proceso.create({
      proyecto_id: proyectoId,
      nombre_proceso: proyecto.nombre,
      tipo: tipo || null,
      estado_id: await resolverEstadoId(estatus),
      prioridad: prioridad || null,
      fecha_creacion: new Date(),
    });

    if (herramientas_ids.length > 0) await proceso.setHerramientas(herramientas_ids);

    const resultado = await Proceso.findByPk(proceso.id, { include: INCLUDE_PROCESO });
    

    return res.status(201).json({ ok: true, mensaje: "Proceso creado.", data: resultado });
  } catch (err) {
    console.error("[crearProceso]", err);
    return res.status(500).json({ ok: false, mensaje: "Error al crear proceso.", detalle: err.message });
  }
};

export const actualizarProceso = async (req, res) => {
  try {
    const proceso = await Proceso.findByPk(req.params.id, {
      include: [{ model: Proyecto, as: "proyecto", attributes: ["id", "cliente_id"] }],
    });
    if (!proceso) return res.status(404).json({ ok: false, mensaje: "Proceso no encontrado." });

    const { nombre_proceso, tipo, prioridad, herramientas_ids } = req.body;

    if (tipo && !TIPOS_CLASIFICACION.includes(tipo))
      return res.status(400).json({ ok: false, mensaje: `'tipo' inválido.` });

    await proceso.update({ nombre_proceso, tipo, prioridad });

    if (Array.isArray(herramientas_ids)) {
      if (herramientas_ids.length > 0) {
        const encontradas = await HerramientaRpa.findAll({ where: { id: herramientas_ids } });
        if (encontradas.length !== herramientas_ids.length)
          return res.status(404).json({ ok: false, mensaje: "Una o más herramientas no encontradas." });
      }
      await proceso.setHerramientas(herramientas_ids);
    }

    const resultado = await Proceso.findByPk(proceso.id, { include: INCLUDE_PROCESO });


    return res.status(200).json({ ok: true, mensaje: "Proceso actualizado.", data: resultado });
  } catch (err) {
    console.error("[actualizarProceso]", err);
    return res.status(500).json({ ok: false, mensaje: "Error al actualizar proceso.", detalle: err.message });
  }
};

export const cambiarEstatus = async (req, res) => {
  try {
    const proceso = await Proceso.findByPk(req.params.id);
    if (!proceso) return res.status(404).json({ ok: false, mensaje: "Proceso no encontrado." });

    const { estatus } = req.body;
    if (!estatus) return res.status(400).json({ ok: false, mensaje: "'estatus' es requerido." });

    const estado_id = await resolverEstadoId(estatus).catch(() => null);
    if (!estado_id) return res.status(400).json({ ok: false, mensaje: `Estatus '${estatus}' no encontrado.` });

    await proceso.update({ estado_id });
    return res.status(200).json({ ok: true, mensaje: `Estatus actualizado a '${estatus}'.`, data: proceso });
  } catch (err) {
    return res.status(500).json({ ok: false, mensaje: err.message });
  }
};

export const eliminarProceso = async (req, res) => {
  try {
    const proceso = await Proceso.findByPk(req.params.id, {
      include: [{ model: Proyecto, as: "proyecto", attributes: ["id", "cliente_id"] }],
    });
    if (!proceso) return res.status(404).json({ ok: false, mensaje: "Proceso no encontrado." });

    const { proyecto_id, proyecto } = proceso;

    await proceso.destroy();

    return res.status(200).json({ ok: true, mensaje: "Proceso eliminado." });
  } catch (err) {
    console.error("[eliminarProceso]", err);
    return res.status(500).json({ ok: false, mensaje: "Error al eliminar proceso.", detalle: err.message });
  }
};

const validarConsultores = async (ids) => {
  if (!ids || !Array.isArray(ids) || ids.length === 0)
    return { ok: false, mensaje: "'consultores_ids' debe ser un array no vacío." };

  const encontrados = await Consultor.findAll({ where: { id: ids } });
  if (encontrados.length !== ids.length) {
    const faltantes = ids.filter(id => !encontrados.map(c => c.id).includes(id));
    return { ok: false, mensaje: `Consultores no encontrados: ${faltantes.join(", ")}.` };
  }
  return { ok: true };
};

const upsertEtapa = async ({ Modelo, procesoId, datos, consultores_ids, aliasSet, res, nombreEtapa }) => {
  try {
    const proceso = await Proceso.findByPk(procesoId, {
      include: [{ model: Proyecto, as: "proyecto", attributes: ["id", "cliente_id"] }],
    });
    if (!proceso)
      return res.status(404).json({ ok: false, mensaje: "Proceso no encontrado." });

    if (consultores_ids !== undefined) {
      const validacion = await validarConsultores(consultores_ids);
      if (!validacion.ok)
        return res.status(400).json({ ok: false, mensaje: validacion.mensaje });
    }

    const [etapa, creada] = await Modelo.findOrCreate({
      where:    { proceso_id: procesoId },
      defaults: { proceso_id: procesoId, ...datos },
    });

    if (!creada) await etapa.update(datos);

    if (consultores_ids !== undefined) {
      await etapa[aliasSet](consultores_ids);
    }

    if (datos.estado_id) {
      await proceso.update({ estado_id: datos.estado_id });
    }

    await etapa.reload({
      include: [{ model: Consultor, as: "consultores", attributes: ["id", "nombre"] }],
    });

    return res.status(creada ? 201 : 200).json({
      ok: true,
      mensaje: `${nombreEtapa} ${creada ? "registrada" : "actualizada"}.`,
      data: etapa,
    });
  } catch (err) {
    console.error(`[upsert${nombreEtapa}]`, err);
    return res.status(500).json({ ok: false, mensaje: `Error en ${nombreEtapa}.`, detalle: err.message });
  }
};

export const upsertLevantamiento = (req, res) => {
  const { consultores_ids, fecha_levantamiento, observaciones, proximos_pasos, estado_id } = req.body;
  return upsertEtapa({
    Modelo: EtapaLevantamiento, procesoId: req.params.id,
    datos: { fecha_levantamiento, observaciones, proximos_pasos, estado_id: estado_id || null },
    consultores_ids, aliasSet: "setConsultores", res, nombreEtapa: "Levantamiento",
  });
};

export const upsertEstimacion = (req, res) => {
  const {
    consultores_ids,
    fecha_estimacion, observaciones, proximos_pasos, estado_id,
    volumen_transaccional_mensual, tiempo_ejecucion_transaccion,
    requiere_captcha, volumen_captcha_mes, costo_mensual_captcha,
    requiere_ai, ai_para_que, ai_nombre, ai_metodo_pago,
    ai_volumen_mensual_tokens, costo_mensual_ai,
    requiere_ocr, ocr_nombre, ocr_volumen_mensual, ocr_costo,
    requiere_idp, idp_documentos, idp_volumen_mensual, costo_mensual_idp,
  } = req.body;

  return upsertEtapa({
    Modelo: EtapaEstimacion, procesoId: req.params.id,
    datos: {
      fecha_estimacion,
      observaciones,
      proximos_pasos,
      estado_id: estado_id || null,
      volumen_transaccional_mensual: volumen_transaccional_mensual ?? null,
      tiempo_ejecucion_transaccion: tiempo_ejecucion_transaccion ?? null,
      requiere_captcha: requiere_captcha ?? false,
      volumen_captcha_mes: volumen_captcha_mes ?? null,
      costo_mensual_captcha: costo_mensual_captcha ?? null,
      requiere_ai: requiere_ai ?? false,
      ai_para_que: ai_para_que ?? null,
      ai_nombre: ai_nombre ?? null,
      ai_metodo_pago: ai_metodo_pago ?? null,
      ai_volumen_mensual_tokens: ai_volumen_mensual_tokens ?? null,
      costo_mensual_ai: costo_mensual_ai ?? null,
      requiere_ocr: requiere_ocr ?? false,
      ocr_nombre: ocr_nombre ?? null,
      ocr_volumen_mensual: ocr_volumen_mensual ?? null,
      ocr_costo: ocr_costo ?? null,
      requiere_idp: requiere_idp ?? false,
      idp_documentos: idp_documentos ?? null,
      idp_volumen_mensual: idp_volumen_mensual ?? null,
      costo_mensual_idp: costo_mensual_idp ?? null,
    },
    consultores_ids, aliasSet: "setConsultores", res, nombreEtapa: "Estimación",
  });
};

export const upsertPropuesta = (req, res) => {
  const {
    consultores_ids, nivel_detalle, fecha_entrega_propuesta,
    valor_presupuestado, horas_presupuestadas, observaciones, estado_id,
    horas_gerencia, valor_gerencia,
    hito_inicio_pct, hito_pruebas_pct, hito_estabilizacion_pct,
    lic_forma_pago, ocr_forma_pago, captcha_forma_pago,
    soporte_forma_pago, idp_forma_pago, ia_forma_pago,
  } = req.body;

  return upsertEtapa({
    Modelo: EtapaPropuesta, procesoId: req.params.id,
    datos: {
      nivel_detalle,
      fecha_entrega_propuesta,
      valor_presupuestado,
      horas_presupuestadas,
      horas_gerencia,
      valor_gerencia,
      observaciones,
      estado_id: estado_id || null,
      hito_inicio_pct: hito_inicio_pct ?? 30,
      hito_pruebas_pct: hito_pruebas_pct ?? 50,
      hito_estabilizacion_pct: hito_estabilizacion_pct ?? 20,
      lic_forma_pago,
      ocr_forma_pago,
      captcha_forma_pago,
      soporte_forma_pago,
      idp_forma_pago,
      ia_forma_pago,
    },
    consultores_ids, aliasSet: "setConsultores", res, nombreEtapa: "Propuesta",
  });
};

export const upsertPreliminar = (req, res) => {
  const { consultores_ids, fecha_preliminar, resultado, observaciones, probabilidad } = req.body;
  return upsertEtapa({
    Modelo: EtapaPreliminar, procesoId: req.params.id,
    datos: { fecha_preliminar, resultado, observaciones, probabilidad: probabilidad || null },
    consultores_ids, aliasSet: "setConsultores", res, nombreEtapa: "Preliminar",
  });
};

export const upsertAprobacion = async (req, res) => {
  const { consultores_ids, aprobado, fecha_aprobacion, motivo_rechazo, fecha_rechazo, observaciones, estado_id } = req.body;

  if (typeof aprobado !== "boolean")
    return res.status(400).json({ ok: false, mensaje: "'aprobado' debe ser boolean." });
  if (!aprobado && !motivo_rechazo)
    return res.status(400).json({ ok: false, mensaje: "'motivo_rechazo' es obligatorio cuando se rechaza." });

  const proceso = await Proceso.findByPk(req.params.id);
  if (!proceso) return res.status(404).json({ ok: false, mensaje: "Proceso no encontrado." });

  await proceso.update({ estado_id: await getEstadoId(aprobado ? "Aprobado" : "Rechazado") });

  return upsertEtapa({
    Modelo: EtapaAprobacion, procesoId: req.params.id,
    datos: { aprobado, fecha_aprobacion, motivo_rechazo, fecha_rechazo, observaciones, estado_id: estado_id || null },
    consultores_ids, aliasSet: "setConsultores", res, nombreEtapa: "Aprobación",
  });
};

export const upsertEjecucion = async (req, res) => {
  const {
    consultores_ids, fecha_inicio, fecha_fin,
    observaciones, proximos_pasos, estado_id,
  } = req.body;

  if (!fecha_inicio)
    return res.status(400).json({ ok: false, mensaje: "'fecha_inicio' es obligatorio." });

  const proceso = await Proceso.findByPk(req.params.id);
  if (!proceso) return res.status(404).json({ ok: false, mensaje: "Proceso no encontrado." });

  const etapaExistente = await EtapaEjecucion.findOne({ where: { proceso_id: req.params.id } });
  if (!etapaExistente)
    await proceso.update({ estado_id: await getEstadoId("En Ejecución") });

  return upsertEtapa({
    Modelo: EtapaEjecucion, procesoId: req.params.id,
    datos: { fecha_inicio, fecha_fin, observaciones, proximos_pasos: proximos_pasos || null, estado_id: estado_id || null },
    consultores_ids, aliasSet: "setConsultores", res, nombreEtapa: "Ejecución",
  });
};

export const upsertAprobado = (req, res) => {
  const { consultores_ids, fecha_aprobado, observaciones, proximos_pasos, estado_id } = req.body;
  return upsertEtapa({
    Modelo: EtapaAprobado, procesoId: req.params.id,
    datos: { fecha_aprobado, observaciones, proximos_pasos, estado_id: estado_id || null },
    consultores_ids, aliasSet: "setConsultores", res, nombreEtapa: "Aprobado",
  });
};

export const upsertCierre = (req, res) => {
  const { consultores_ids, fecha_cierre, observaciones, proximos_pasos, estado_id, horas_reales } = req.body;
  return upsertEtapa({
    Modelo: EtapaCierre, procesoId: req.params.id,
    datos: { fecha_cierre, observaciones, proximos_pasos, estado_id: estado_id || null, horas_reales: horas_reales || null },
    consultores_ids, aliasSet: "setConsultores", res, nombreEtapa: "Cierre",
  });
};

const calcularFechaVencimiento = (fechaFactura, diasCredito) => {
  if (!fechaFactura || !diasCredito) return fechaFactura || null;
  const d = new Date(fechaFactura);
  d.setDate(d.getDate() + Number(diasCredito));
  return d.toISOString().split('T')[0];
};

export const upsertFacturado = async (req, res) => {
  try {
    const { id: procesoId } = req.params;
    const {
      consultores_ids,
      observaciones, proximos_pasos, estado_id,
      facturas = [],
    } = req.body;

    let etapa = await EtapaFacturado.findOne({ where: { proceso_id: procesoId } });
    if (!etapa) {
      etapa = await EtapaFacturado.create({ proceso_id: procesoId });
    }

    await etapa.update({ observaciones, proximos_pasos, estado_id: estado_id || null });

    if (consultores_ids?.length) {
      const cons = await Consultor.findAll({ where: { id: consultores_ids } });
      await etapa.setConsultores(cons);
    }

    const idsEnviados = facturas.filter(f => f.id).map(f => f.id);

    await EtapaFacturadoItem.destroy({
      where: {
        etapa_facturado_id: etapa.id,
        ...(idsEnviados.length ? { id: { [Op.notIn]: idsEnviados } } : {}),
      }
    });

    for (const f of facturas) {
      const fechaVenc = calcularFechaVencimiento(f.fecha_factura, f.dias_credito);
      const data = {
        etapa_facturado_id: etapa.id,
        nombre:             f.nombre         || null,
        numero_factura:     f.numero_factura  || null,
        fecha_factura:      f.fecha_factura   || null,
        dias_credito:       f.dias_credito    ?? 0,
        fecha_vencimiento:  fechaVenc,
        valor_facturado:    f.valor_facturado ?? null,
        estado_cobro:       f.estado_cobro    || "Pendiente",
      };
      if (f.id) {
        await EtapaFacturadoItem.update(data, { where: { id: f.id } });
      } else {
        await EtapaFacturadoItem.create(data);
      }
    }

    const resultado = await EtapaFacturado.findByPk(etapa.id, {
      include: [
        { model: Consultor,        as: "consultores", attributes: ["id", "nombre"], through: { attributes: [] } },
        { model: EtapaFacturadoItem, as: "facturas" },
      ]
    });

    const proceso = await Proceso.findByPk(procesoId, {
      include: [{ model: Proyecto, as: "proyecto", attributes: ["id", "cliente_id"] }],
    });
    return res.status(200).json({ ok: true, data: resultado });
  } catch (err) {
    console.error("[upsertFacturado]", err);
    return res.status(500).json({ ok: false, mensaje: "Error al guardar facturado.", detalle: err.message });
  }
};

export const upsertRechazado = (req, res) => {
  const {
    consultores_ids, fecha_rechazo, motivo_categoria,
    motivo_detalle, decision_por, recuperable,
    fecha_recontacto, observaciones, proximos_pasos, estado_id,
  } = req.body;
  return upsertEtapa({
    Modelo: EtapaRechazado, procesoId: req.params.id,
    datos: {
      fecha_rechazo, motivo_categoria, motivo_detalle,
      decision_por, recuperable, fecha_recontacto,
      observaciones, proximos_pasos,
      estado_id: estado_id || null,
    },
    consultores_ids, aliasSet: "setConsultores", res, nombreEtapa: "Rechazado",
  });
};

export const upsertStandBy = (req, res) => {
  const {
    consultores_ids, fecha_inicio_pausa, fecha_estimada_retorno,
    motivo_categoria, motivo_detalle, decision_por,
    condicion_reactivar, observaciones, proximos_pasos, estado_id,
  } = req.body;
  return upsertEtapa({
    Modelo: EtapaStandBy, procesoId: req.params.id,
    datos: {
      fecha_inicio_pausa, fecha_estimada_retorno,
      motivo_categoria, motivo_detalle, decision_por,
      condicion_reactivar, observaciones, proximos_pasos,
      estado_id: estado_id || null,
    },
    consultores_ids, aliasSet: "setConsultores", res, nombreEtapa: "StandBy",
  });
};

export const listarInteracciones = async (req, res) => {
  try {
    const proceso = await Proceso.findByPk(req.params.id);
    if (!proceso) return res.status(404).json({ ok: false, mensaje: "Proceso no encontrado." });

    const interacciones = await Interaccion.findAll({
      where: { proceso_id: req.params.id },
      include: [{ model: Consultor, as: "consultor", attributes: ["id", "nombre"] }],
      order: [["fecha", "DESC"]],
    });
    return res.status(200).json({ ok: true, data: interacciones });
  } catch (err) {
    console.error("[listarInteracciones]", err);
    return res.status(500).json({ ok: false, mensaje: "Error al obtener interacciones.", detalle: err.message });
  }
};

export const crearInteraccion = async (req, res) => {
  try {
    const proceso = await Proceso.findByPk(req.params.id);
    if (!proceso) return res.status(404).json({ ok: false, mensaje: "Proceso no encontrado." });

    const { consultor_id, tipo, descripcion, fecha } = req.body;
    if (!consultor_id) return res.status(400).json({ ok: false, mensaje: "'consultor_id' es obligatorio." });
    if (!fecha) return res.status(400).json({ ok: false, mensaje: "'fecha' es obligatoria." });
    if (tipo && !TIPOS_INTERACCION.includes(tipo))
      return res.status(400).json({ ok: false, mensaje: `'tipo' inválido. Válidos: ${TIPOS_INTERACCION.join(", ")}.` });

    const consultor = await Consultor.findByPk(consultor_id);
    if (!consultor) return res.status(404).json({ ok: false, mensaje: "Consultor no encontrado." });

    const interaccion = await Interaccion.create({ proceso_id: req.params.id, consultor_id, tipo, descripcion, fecha });
    return res.status(201).json({ ok: true, mensaje: "Interacción registrada.", data: interaccion });
  } catch (err) {
    console.error("[crearInteraccion]", err);
    return res.status(500).json({ ok: false, mensaje: "Error al crear interacción.", detalle: err.message });
  }
};

export const eliminarInteraccion = async (req, res) => {
  try {
    const interaccion = await Interaccion.findOne({
      where: { id: req.params.interaccionId, proceso_id: req.params.id },
    });
    if (!interaccion) return res.status(404).json({ ok: false, mensaje: "Interacción no encontrada." });
    await interaccion.destroy();
    return res.status(200).json({ ok: true, mensaje: "Interacción eliminada." });
  } catch (err) {
    console.error("[eliminarInteraccion]", err);
    return res.status(500).json({ ok: false, mensaje: "Error al eliminar interacción.", detalle: err.message });
  }
};

const makeInteraccionHandlers = ({ EtapaModelo, InteraccionModelo, etapaFk, nombre }) => ({
  listar: async (req, res) => {
    try {
      const etapa = await EtapaModelo.findOne({ where: { proceso_id: req.params.id } });
      if (!etapa) return res.status(200).json({ ok: true, data: [] });
      const interacciones = await InteraccionModelo.findAll({
        where: { [etapaFk]: etapa.id },
        include: [
          { model: Consultor, as: "consultores", attributes: ["id", "nombre"], through: { attributes: [] } },
          { model: Estados, as: "estadoObj", attributes: ["id", "nombre"] },
        ],
        order: [["fecha", "DESC"]],
      });
      return res.status(200).json({ ok: true, data: interacciones });
    } catch (err) {
      return res.status(500).json({ ok: false, mensaje: err.message });
    }
  },

  crear: async (req, res) => {
    try {
      const etapa = await EtapaModelo.findOne({ where: { proceso_id: req.params.id } });
      if (!etapa) return res.status(404).json({ ok: false, mensaje: `Etapa ${nombre} no encontrada.` });

      const { consultores_ids = [], fecha, observaciones, proximos_pasos, estado_id } = req.body;
      if (!fecha) return res.status(400).json({ ok: false, mensaje: "'fecha' es obligatoria." });

      const interaccion = await InteraccionModelo.create({
        [etapaFk]: etapa.id, fecha, observaciones, proximos_pasos,
        estado_id: estado_id || null,
      });
      if (consultores_ids.length > 0) await interaccion.setConsultores(consultores_ids);

      if (estado_id) {
        await Proceso.update({ estado_id }, { where: { id: req.params.id } });
      }

      const resultado = await InteraccionModelo.findByPk(interaccion.id, {
        include: [
          { model: Consultor, as: "consultores", attributes: ["id", "nombre"], through: { attributes: [] } },
          { model: Estados, as: "estadoObj", attributes: ["id", "nombre"] },
        ],
      });
      return res.status(201).json({ ok: true, data: resultado });
    } catch (err) {
      return res.status(500).json({ ok: false, mensaje: err.message });
    }
  },

  eliminar: async (req, res) => {
    try {
      const interaccion = await InteraccionModelo.findByPk(req.params.interaccionId);
      if (!interaccion) return res.status(404).json({ ok: false, mensaje: "Interacción no encontrada." });
      await interaccion.destroy();
      return res.status(200).json({ ok: true, mensaje: "Interacción eliminada." });
    } catch (err) {
      return res.status(500).json({ ok: false, mensaje: err.message });
    }
  },
});

const lev = makeInteraccionHandlers({ EtapaModelo: EtapaLevantamiento, InteraccionModelo: InteraccionLevantamiento, etapaFk: "etapa_levantamiento_id", nombre: "Levantamiento" });
const est = makeInteraccionHandlers({ EtapaModelo: EtapaEstimacion, InteraccionModelo: InteraccionEstimacion, etapaFk: "etapa_estimacion_id", nombre: "Estimación" });
const prop = makeInteraccionHandlers({ EtapaModelo: EtapaPropuesta, InteraccionModelo: InteraccionPropuesta, etapaFk: "etapa_propuesta_id", nombre: "Propuesta" });
const apr = makeInteraccionHandlers({ EtapaModelo: EtapaAprobacion, InteraccionModelo: InteraccionAprobacion, etapaFk: "etapa_aprobacion_id", nombre: "Aprobación" });
const apro = makeInteraccionHandlers({ EtapaModelo: EtapaAprobado, InteraccionModelo: InteraccionAprobado, etapaFk: "etapa_aprobado_id", nombre: "Aprobado" });
const eje = makeInteraccionHandlers({ EtapaModelo: EtapaEjecucion, InteraccionModelo: InteraccionEjecucion, etapaFk: "etapa_ejecucion_id", nombre: "Ejecución" });
const cier = makeInteraccionHandlers({ EtapaModelo: EtapaCierre, InteraccionModelo: InteraccionCierre, etapaFk: "etapa_cierre_id", nombre: "Cierre" });
const fact = makeInteraccionHandlers({ EtapaModelo: EtapaFacturado, InteraccionModelo: InteraccionFacturado, etapaFk: "etapa_facturado_id", nombre: "Facturado" });
const rech = makeInteraccionHandlers({ EtapaModelo: EtapaRechazado, InteraccionModelo: InteraccionRechazado, etapaFk: "etapa_rechazado_id", nombre: "Rechazado" });
const stby = makeInteraccionHandlers({ EtapaModelo: EtapaStandBy, InteraccionModelo: InteraccionStandBy, etapaFk: "etapa_stand_by_id", nombre: "StandBy" });

export const listarInteraccionesLevantamiento = lev.listar;
export const crearInteraccionLevantamiento = lev.crear;
export const eliminarInteraccionLevantamiento = lev.eliminar;

export const listarInteraccionesEstimacion = est.listar;
export const crearInteraccionEstimacion = est.crear;
export const eliminarInteraccionEstimacion = est.eliminar;

export const listarInteraccionesPropuesta = prop.listar;
export const crearInteraccionPropuesta = prop.crear;
export const eliminarInteraccionPropuesta = prop.eliminar;

export const listarInteraccionesAprobacion = apr.listar;
export const crearInteraccionAprobacion = apr.crear;
export const eliminarInteraccionAprobacion = apr.eliminar;

export const listarInteraccionesAprobado = apro.listar;
export const crearInteraccionAprobado = apro.crear;
export const eliminarInteraccionAprobado = apro.eliminar;

export const listarInteraccionesEjecucion = eje.listar;
export const crearInteraccionEjecucion = eje.crear;
export const eliminarInteraccionEjecucion = eje.eliminar;

export const listarInteraccionesCierre = cier.listar;
export const crearInteraccionCierre = cier.crear;
export const eliminarInteraccionCierre = cier.eliminar;

export const listarInteraccionesFacturado = fact.listar;
export const crearInteraccionFacturado = fact.crear;
export const eliminarInteraccionFacturado = fact.eliminar;

export const listarInteraccionesRechazado = rech.listar;
export const crearInteraccionRechazado = rech.crear;
export const eliminarInteraccionRechazado = rech.eliminar;

export const listarInteraccionesStandBy = stby.listar;
export const crearInteraccionStandBy = stby.crear;
export const eliminarInteraccionStandBy = stby.eliminar;