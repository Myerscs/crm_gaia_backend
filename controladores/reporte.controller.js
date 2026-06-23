import { Op, fn, col, literal } from "sequelize";
import { sequelize } from "../config/database.js";
import {
  Cliente,
  Consultor,
  Proyecto,
  Proceso,
  EstadoProyecto,
  EtapaAprobacion,
  EtapaEjecucion,
  EtapaPropuesta,
  EtapaLevantamiento,
  EtapaEstimacion,
  EtapaPreliminar,
  HerramientaRpa,
  AsignacionHerramientas,
  ProyectoArea,
  Area,
  Interaccion,
  UsuarioCliente,
} from "../modelos/relations.js";

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const rangoFecha = (desde, hasta) => {
  const filtro = {};
  if (desde) filtro[Op.gte] = new Date(desde);
  if (hasta) {
    const d = new Date(hasta);
    d.setHours(23, 59, 59, 999);
    filtro[Op.lte] = d;
  }
  return Object.keys(filtro).length ? filtro : null;
};

const pct = (parte, total) =>
  total === 0 ? 0 : Math.round((parte / total) * 1000) / 10;

// ─────────────────────────────────────────────────────────────────────────────
// 1. DASHBOARD EJECUTIVO
//    GET /reportes/dashboard
// ─────────────────────────────────────────────────────────────────────────────
export const dashboardEjecutivo = async (req, res) => {
  try {
    const { desde, hasta } = req.query;
    const filtroFecha = rangoFecha(desde, hasta);
    const whereCreado = filtroFecha ? { createdAt: filtroFecha } : {};

    const [totalClientes, clientesNuevos] = await Promise.all([
      Cliente.count(),
      Cliente.count({ where: whereCreado }),
    ]);

    const [totalConsultores, consultoresActivos] = await Promise.all([
      Consultor.count(),
      Consultor.count({ where: { activo: true } }),
    ]);

    const proyectosPorEstado = await Proyecto.findAll({
      attributes: ["estado_actual", [fn("COUNT", col("id")), "total"]],
      group: ["estado_actual"],
      raw: true,
    });
    const totalProyectos = proyectosPorEstado.reduce((a, r) => a + parseInt(r.total), 0);
    const proyectosActivos = proyectosPorEstado
      .filter(r => !["Cancelado", "Completado"].includes(r.estado_actual))
      .reduce((a, r) => a + parseInt(r.total), 0);

    const procesosPorEstatus = await Proceso.findAll({
      attributes: ["estatus", [fn("COUNT", col("id")), "total"]],
      group: ["estatus"],
      raw: true,
    });
    const totalProcesos     = procesosPorEstatus.reduce((a, r) => a + parseInt(r.total), 0);
    const procesosAprobados  = parseInt(procesosPorEstatus.find(r => r.estatus === "Aprobado")?.total  ?? 0);
    const procesosRechazados = parseInt(procesosPorEstatus.find(r => r.estatus === "Rechazado")?.total ?? 0);

    // ✅ ORM puro — evita nombre de tabla hardcodeado
    const [finanzasRow] = await EtapaPropuesta.findAll({
      attributes: [
        [fn("SUM", col("valor_presupuestado")),  "valor_total"],
        [fn("SUM", col("horas_presupuestadas")), "horas_total"],
        [fn("AVG", col("valor_presupuestado")),  "valor_promedio"],
      ],
      raw: true,
    });

    // ✅ Join ORM — Proceso sin alias en relations.js → NO poner "as"
    const [finanzasAprobRow] = await EtapaPropuesta.findAll({
      attributes: [
        [fn("SUM", col("EtapaPropuesta.valor_presupuestado")),  "valor_aprobado"],
        [fn("SUM", col("EtapaPropuesta.horas_presupuestadas")), "horas_aprobadas"],
      ],
      include: [{
        model:    Proceso,
        attributes: [],
        where:    { estatus: "Aprobado" },
        required: true,
      }],
      raw: true,
    });

    const [ejecRow] = await EtapaEjecucion.findAll({
      attributes: [
        [fn("SUM", col("horas_reales")), "horas_reales_total"],
        [fn("AVG", col("horas_reales")), "horas_reales_promedio"],
      ],
      raw: true,
    });

    const herramientasActivas = await AsignacionHerramientas.count({ where: { estado: "Activa" } });

    return res.status(200).json({
      ok: true,
      periodo: { desde: desde ?? null, hasta: hasta ?? null },
      kpis: {
        clientes: { total: totalClientes, nuevos: clientesNuevos },
        consultores: {
          total: totalConsultores, activos: consultoresActivos,
          inactivos: totalConsultores - consultoresActivos,
        },
        proyectos: {
          total: totalProyectos, activos: proyectosActivos,
          porEstado: proyectosPorEstado.map(r => ({ estado: r.estado_actual, total: parseInt(r.total) })),
        },
        pipeline: {
          total: totalProcesos, aprobados: procesosAprobados, rechazados: procesosRechazados,
          tasaConversion: `${pct(procesosAprobados, totalProcesos)}%`,
          tasaRechazo:    `${pct(procesosRechazados, totalProcesos)}%`,
          porEstatus: procesosPorEstatus.map(r => ({
            estatus: r.estatus, total: parseInt(r.total),
            pct: pct(parseInt(r.total), totalProcesos),
          })),
        },
        finanzas: {
          valorPresupuestadoTotal:    parseFloat(finanzasRow?.valor_total    ?? 0),
          valorPresupuestadoPromedio: parseFloat(finanzasRow?.valor_promedio ?? 0),
          horasPresupuestadasTotal:   parseFloat(finanzasRow?.horas_total    ?? 0),
          valorAprobadoTotal:         parseFloat(finanzasAprobRow?.valor_aprobado   ?? 0),
          horasAprobadasTotal:        parseFloat(finanzasAprobRow?.horas_aprobadas  ?? 0),
          horasRealesTotal:           parseFloat(ejecRow?.horas_reales_total    ?? 0),
          horasRealesPromedio:        parseFloat(ejecRow?.horas_reales_promedio ?? 0),
        },
        herramientas: { asignacionesActivas: herramientasActivas },
      },
    });
  } catch (err) {
    console.error("[dashboardEjecutivo]", err);
    return res.status(500).json({ ok: false, mensaje: "Error en dashboard ejecutivo.", detalle: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. REPORTE PROYECTOS
//    GET /reportes/proyectos
// ─────────────────────────────────────────────────────────────────────────────
export const reporteProyectos = async (req, res) => {
  try {
    const { desde, hasta, clienteId } = req.query;
    const filtroFecha = rangoFecha(desde, hasta);
    const where = {};
    if (filtroFecha) where.createdAt  = filtroFecha;
    if (clienteId)   where.cliente_id = clienteId;

    const porEstado = await Proyecto.findAll({
      attributes: ["estado_actual", [fn("COUNT", col("Proyecto.id")), "total"]],
      where,
      group: ["estado_actual"],
      raw: true,
    });

    // ✅ ORM join con alias del ProyectoArea
    const porArea = await ProyectoArea.findAll({
      attributes: [[fn("COUNT", col("ProyectoArea.proyecto_id")), "total"]],
      include: [{ model: Area, attributes: ["nombre"] }],
      group: ["Area.nombre", "Area.id"],
      order: [[fn("COUNT", col("ProyectoArea.proyecto_id")), "DESC"]],
      raw: true,
    });

    const proyectos = await Proyecto.findAll({
      attributes: ["id", "nombre", "estado_actual", "horas_estimadas", "activo", "createdAt"],
      where,
      include: [{ model: Cliente, as: "cliente", attributes: [ "empresa"] }],
      order: [["createdAt", "DESC"]],
    });

    // ✅ MySQL: DATE_FORMAT en vez de DATE_TRUNC
    const tendenciaMensual = await Proyecto.findAll({
      attributes: [
        [fn("DATE_FORMAT", col("createdAt"), "%Y-%m-01"), "mes"],
        [fn("COUNT", col("id")), "total"],
      ],
      where: { createdAt: { [Op.gte]: literal("DATE_SUB(NOW(), INTERVAL 12 MONTH)") } },
      group:  [literal("DATE_FORMAT(`Proyecto`.`createdAt`, '%Y-%m-01')")],
      order:  [[literal("DATE_FORMAT(`Proyecto`.`createdAt`, '%Y-%m-01')"), "ASC"]],
      raw: true,
    });

    return res.status(200).json({
      ok: true,
      resumen: {
        total:    proyectos.length,
        porEstado: porEstado.map(r => ({ estado: r.estado_actual, total: parseInt(r.total) })),
        porArea:   porArea.map(r => ({ area: r["Area.nombre"], total: parseInt(r.total) })),
      },
      tendenciaMensual: tendenciaMensual.map(r => ({ mes: r.mes, total: parseInt(r.total) })),
      proyectos,
    });
  } catch (err) {
    console.error("[reporteProyectos]", err);
    return res.status(500).json({ ok: false, mensaje: "Error en reporte de proyectos.", detalle: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. PIPELINE
//    GET /reportes/pipeline
// ─────────────────────────────────────────────────────────────────────────────
export const reportePipeline = async (req, res) => {
  try {
    const { desde, hasta, proyectoId } = req.query;
    const filtroFecha = rangoFecha(desde, hasta);
    const where = {};
    if (filtroFecha) where.createdAt   = filtroFecha;
    if (proyectoId)  where.proyecto_id = proyectoId;

    const porEstatus = await Proceso.findAll({
      attributes: ["estatus", [fn("COUNT", col("id")), "total"]],
      where,
      group: ["estatus"],
      raw: true,
    });
    const totalProcesos = porEstatus.reduce((a, r) => a + parseInt(r.total), 0);

    const porTipo = await Proceso.findAll({
      attributes: ["tipo_proceso", [fn("COUNT", col("id")), "total"]],
      where,
      group: ["tipo_proceso"],
      raw: true,
    });

    const porClasificacion = await Proceso.findAll({
      attributes: ["tipo", [fn("COUNT", col("id")), "total"]],
      where,
      group: ["tipo"],
      raw: true,
    });

    const probabilidad = await Proceso.findAll({
      attributes: [
        "tipo_proceso",
        [fn("AVG", col("probabilidad_aprobacion")), "prob_promedio"],
        [fn("COUNT", col("id")), "total"],
      ],
      where: { probabilidad_aprobacion: { [Op.ne]: null } },
      group: ["tipo_proceso"],
      raw: true,
    });

    // ✅ MySQL DATE_FORMAT — Proceso tiene timestamps: true → createdAt existe
    const tendencia = await Proceso.findAll({
      attributes: [
        [fn("DATE_FORMAT", col("Proceso.createdAt"), "%Y-%m-01"), "mes"],
        "estatus",
        [fn("COUNT", col("Proceso.id")), "total"],
      ],
      where: { createdAt: { [Op.gte]: literal("DATE_SUB(NOW(), INTERVAL 12 MONTH)") } },
      group:  [literal("DATE_FORMAT(`Proceso`.`createdAt`, '%Y-%m-01')"), "estatus"],
      order:  [[literal("DATE_FORMAT(`Proceso`.`createdAt`, '%Y-%m-01')"), "ASC"]],
      raw: true,
    });

    // ✅ Top procesos usando aliases correctos de relations.js
    const topProcesos = await Proceso.findAll({
      attributes: ["id", "nombre_proceso", "estatus", "tipo_proceso"],
      include: [
        {
          model:    EtapaPropuesta,
          as:       "propuesta",
          attributes: ["valor_presupuestado", "horas_presupuestadas"],
          required: true,
        },
        {
          model: Proyecto,
          as:    "proyecto",
          attributes: ["nombre"],
          include: [{ model: Cliente, as: "cliente", attributes: ["empresa"] }],
        },
      ],
      order: [[{ model: EtapaPropuesta, as: "propuesta" }, "valor_presupuestado", "DESC"]],
      limit: 10,
    });

    // ✅ FIX: p.createdAt (Proceso sí tiene timestamps) y fechas reales de cada etapa
    //    EtapaLevantamiento: timestamps:false → usa fecha_levantamiento
    //    EtapaEstimacion:    timestamps:true  → usa createdAt
    //    EtapaPropuesta:     timestamps:false → usa fecha_entrega_propuesta
    //    EtapaAprobacion:    timestamps:false → usa fecha_aprobacion
    const [tiempoEtapas] = await sequelize.query(
      `SELECT
        AVG(TIMESTAMPDIFF(DAY, p.createdAt, el.fecha_levantamiento))       AS dias_hasta_levantamiento,
        AVG(TIMESTAMPDIFF(DAY, el.fecha_levantamiento, ee.createdAt))       AS dias_hasta_estimacion,
        AVG(TIMESTAMPDIFF(DAY, ee.createdAt, ep.fecha_entrega_propuesta))   AS dias_hasta_propuesta,
        AVG(TIMESTAMPDIFF(DAY, ep.fecha_entrega_propuesta, ea.fecha_aprobacion)) AS dias_hasta_aprobacion
       FROM procesos p
       LEFT JOIN etapa_levantamiento el ON el.proceso_id = p.id
       LEFT JOIN etapa_estimacion    ee ON ee.proceso_id = p.id
       LEFT JOIN etapa_propuesta     ep ON ep.proceso_id = p.id
       LEFT JOIN etapa_aprobacion    ea ON ea.proceso_id = p.id`,
      { type: sequelize.QueryTypes.SELECT }
    );

    return res.status(200).json({
      ok: true,
      resumen: {
        totalProcesos,
        tasaConversion: pct(
          parseInt(porEstatus.find(r => r.estatus === "Aprobado")?.total ?? 0),
          totalProcesos
        ),
        funnel: porEstatus.map(r => ({
          estatus: r.estatus, total: parseInt(r.total), pct: pct(parseInt(r.total), totalProcesos),
        })),
        porTipo:          porTipo.map(r => ({ tipo: r.tipo_proceso, total: parseInt(r.total) })),
        porClasificacion: porClasificacion.map(r => ({
          clasificacion: r.tipo ?? "Sin clasificar", total: parseInt(r.total),
        })),
        tiempoPromedioEtapas: {
          diasHastaLevantamiento: parseFloat(tiempoEtapas?.dias_hasta_levantamiento ?? 0).toFixed(1),
          diasHastaEstimacion:    parseFloat(tiempoEtapas?.dias_hasta_estimacion    ?? 0).toFixed(1),
          diasHastaPropuesta:     parseFloat(tiempoEtapas?.dias_hasta_propuesta     ?? 0).toFixed(1),
          diasHastaAprobacion:    parseFloat(tiempoEtapas?.dias_hasta_aprobacion    ?? 0).toFixed(1),
        },
        probabilidadAprobacion: probabilidad.map(r => ({
          tipo:          r.tipo_proceso,
          promedio:      parseFloat(r.prob_promedio ?? 0).toFixed(1) + "%",
          totalProcesos: parseInt(r.total),
        })),
      },
      tendenciaMensual: tendencia.map(r => ({ mes: r.mes, estatus: r.estatus, total: parseInt(r.total) })),
      topProcesos,
    });
  } catch (err) {
    console.error("[reportePipeline]", err);
    return res.status(500).json({ ok: false, mensaje: "Error en reporte de pipeline.", detalle: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 4. FINANCIERO
//    GET /reportes/financiero
// ─────────────────────────────────────────────────────────────────────────────
export const reporteFinanciero = async (req, res) => {
  try {
    // ✅ ORM con alias "propuesta"
    const procesosConPropuesta = await Proceso.findAll({
      attributes: [
        "estatus",
        [fn("SUM", col("propuesta.valor_presupuestado")),  "valor_total"],
        [fn("SUM", col("propuesta.horas_presupuestadas")), "horas_total"],
        [fn("COUNT", col("Proceso.id")), "total_procesos"],
      ],
      include: [{
        model:      EtapaPropuesta,
        as:         "propuesta",
        attributes: [],
      }],
      group: ["Proceso.estatus"],
      order: [[literal("valor_total"), "DESC"]],
      raw: true,
    });

    // ✅ MySQL: CASE WHEN en vez de FILTER (WHERE ...)
    const topClientesPorValor = await sequelize.query(
      `SELECT c.nombre AS cliente, c.empresa,
              COALESCE(SUM(CASE WHEN p2.estatus = 'Aprobado' THEN ep.valor_presupuestado ELSE 0 END), 0) AS valor_aprobado,
              COALESCE(SUM(CASE WHEN p2.estatus = 'Aprobado' THEN ep.horas_presupuestadas ELSE 0 END), 0) AS horas_aprobadas,
              COUNT(DISTINCT CASE WHEN p2.estatus = 'Aprobado' THEN p2.id END) AS procesos_aprobados
       FROM clientes c
       JOIN proyectos pr ON pr.cliente_id = c.id
       JOIN procesos p2 ON p2.proyecto_id = pr.id
       LEFT JOIN etapa_propuesta ep ON ep.proceso_id = p2.id
       GROUP BY c.id, c.nombre, c.empresa
       HAVING valor_aprobado > 0
       ORDER BY valor_aprobado DESC
       LIMIT 15`,
      { type: sequelize.QueryTypes.SELECT }
    );

    // ✅ Tabla real: etapa_propuesta y etapa_ejecucion (singular)
    const eficienciaHoras = await sequelize.query(
      `SELECT p.nombre_proceso, p.estatus, p.tipo_proceso,
              ep.horas_presupuestadas,
              ee.horas_reales,
              CASE WHEN ep.horas_presupuestadas > 0
                   THEN ROUND(ee.horas_reales / ep.horas_presupuestadas * 100, 1)
                   ELSE NULL END AS pct_desviacion
       FROM procesos p
       JOIN etapa_propuesta ep ON ep.proceso_id = p.id
       JOIN etapa_ejecucion ee ON ee.proceso_id = p.id
       WHERE ep.horas_presupuestadas IS NOT NULL
         AND ee.horas_reales IS NOT NULL
       ORDER BY pct_desviacion DESC
       LIMIT 20`,
      { type: sequelize.QueryTypes.SELECT }
    );

    // ✅ FIX: p.createdAt (camelCase) — Proceso tiene timestamps: true
    const tendenciaValor = await sequelize.query(
      `SELECT DATE_FORMAT(p.createdAt, '%Y-%m-01') AS mes,
              COALESCE(SUM(ep.valor_presupuestado), 0) AS valor_aprobado,
              COUNT(p.id) AS procesos_aprobados
       FROM procesos p
       JOIN etapa_propuesta ep ON ep.proceso_id = p.id
       WHERE p.estatus = 'Aprobado'
         AND p.createdAt >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
       GROUP BY DATE_FORMAT(p.createdAt, '%Y-%m-01')
       ORDER BY mes ASC`,
      { type: sequelize.QueryTypes.SELECT }
    );

    const [preciosRow] = await Cliente.findAll({
      attributes: [
        [fn("AVG", col("precio_hora_desarrollo")), "avg_desarrollo"],
        [fn("AVG", col("precio_hora_soporte")),     "avg_soporte"],
        [fn("AVG", col("precio_hora_cambio")),      "avg_cambio"],
        [fn("AVG", col("porcentaje_gobierno")),      "avg_gobierno"],
        [fn("MAX", col("precio_hora_desarrollo")),  "max_desarrollo"],
        [fn("MIN", col("precio_hora_desarrollo")),  "min_desarrollo"],
      ],
      where: { precio_hora_desarrollo: { [Op.ne]: null } },
      raw: true,
    });

    const totales = procesosConPropuesta.reduce(
      (acc, r) => {
        const v = parseFloat(r.valor_total ?? 0);
        const h = parseFloat(r.horas_total ?? 0);
        acc.valorTotal += v;
        acc.horasTotal += h;
        if (r.estatus === "Aprobado") { acc.valorAprobado += v; acc.horasAprobadas += h; }
        return acc;
      },
      { valorTotal: 0, horasTotal: 0, valorAprobado: 0, horasAprobadas: 0 }
    );

    return res.status(200).json({
      ok: true,
      resumen: {
        ...totales,
        valorEnPipeline: totales.valorTotal - totales.valorAprobado,
        preciosHoraClientes: {
          promedioDesarrollo: parseFloat(preciosRow?.avg_desarrollo ?? 0),
          promedioSoporte:    parseFloat(preciosRow?.avg_soporte    ?? 0),
          promedioCambio:     parseFloat(preciosRow?.avg_cambio     ?? 0),
          promedioGobierno:   parseFloat(preciosRow?.avg_gobierno   ?? 0),
          maxDesarrollo:      parseFloat(preciosRow?.max_desarrollo ?? 0),
          minDesarrollo:      parseFloat(preciosRow?.min_desarrollo ?? 0),
        },
      },
      valorPorEstatus: procesosConPropuesta.map(r => ({
        estatus:       r.estatus,
        valorTotal:    parseFloat(r.valor_total    ?? 0),
        horasTotal:    parseFloat(r.horas_total    ?? 0),
        totalProcesos: parseInt(r.total_procesos   ?? 0),
      })),
      topClientesPorValor,
      eficienciaHoras,
      tendenciaValorMensual: tendenciaValor.map(r => ({
        mes:               r.mes,
        valorAprobado:     parseFloat(r.valor_aprobado),
        procesosAprobados: parseInt(r.procesos_aprobados),
      })),
    });
  } catch (err) {
    console.error("[reporteFinanciero]", err);
    return res.status(500).json({ ok: false, mensaje: "Error en reporte financiero.", detalle: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 5. CONSULTORES
//    GET /reportes/consultores
// ─────────────────────────────────────────────────────────────────────────────
export const reporteConsultores = async (req, res) => {
  try {
    // ✅ FIX: etapa_ejecucion NO tiene consultor_responsable_id.
    //    La relación es N:M a través de etapa_ejecucion_consultor.
    //    Se hace el JOIN correcto por la tabla pivote.
    const horasPorConsultor = await sequelize.query(
      `SELECT c.id, c.nombre, c.rol,
              COUNT(DISTINCT ee.proceso_id) AS proyectos_ejecutados,
              COALESCE(SUM(ee.horas_reales), 0) AS horas_ejecutadas
       FROM consultores c
       LEFT JOIN etapa_ejecucion_consultor eec ON eec.consultor_id = c.id
       LEFT JOIN etapa_ejecucion ee ON ee.id = eec.etapa_ejecucion_id
       GROUP BY c.id, c.nombre, c.rol
       ORDER BY horas_ejecutadas DESC`,
      { type: sequelize.QueryTypes.SELECT }
    );

    // ✅ ORM usando aliases de relations.js
    const consultoresList = await Consultor.findAll({
      attributes: ["id", "nombre"],
      include: [
        { model: EtapaLevantamiento, as: "levantamientos", attributes: ["id"], through: { attributes: [] } },
        { model: EtapaEstimacion,    as: "estimaciones",   attributes: ["id"], through: { attributes: [] } },
        { model: EtapaPropuesta,     as: "propuestas",     attributes: ["id"], through: { attributes: [] } },
        { model: EtapaPreliminar,    as: "preliminares",   attributes: ["id"], through: { attributes: [] } },
        { model: EtapaAprobacion,    as: "aprobaciones",   attributes: ["id"], through: { attributes: [] } },
        { model: EtapaEjecucion,     as: "ejecuciones",    attributes: ["id"], through: { attributes: [] } },
      ],
    });

    const participacionPorEtapa = consultoresList.map(c => ({
      id:             c.id,
      nombre:         c.nombre,
      levantamientos: c.levantamientos?.length ?? 0,
      estimaciones:   c.estimaciones?.length   ?? 0,
      propuestas:     c.propuestas?.length      ?? 0,
      preliminares:   c.preliminares?.length    ?? 0,
      aprobaciones:   c.aprobaciones?.length    ?? 0,
      ejecuciones:    c.ejecuciones?.length     ?? 0,
    }));

    // Interacciones últimos 30 días
    const interaccionesUltimos30Dias = await Interaccion.findAll({
      attributes: [
        "consultor_id",
        [fn("COUNT", col("Interaccion.id")), "total_interacciones"],
        [fn("COUNT", fn("DISTINCT", col("proceso_id"))), "procesos_contactados"],
      ],
      where: { fecha: { [Op.gte]: literal("DATE_SUB(NOW(), INTERVAL 30 DAY)") } },
      include: [{ model: Consultor, as: "consultor", attributes: ["nombre", "rol"] }],
      group: ["consultor_id", "consultor.id", "consultor.nombre", "consultor.rol"],
      order: [[fn("COUNT", col("Interaccion.id")), "DESC"]],
    });

    // ✅ Tasa de aprobación por consultor — via tabla pivote correcta
    const tasaAprobacionPorConsultor = await sequelize.query(
      `SELECT c.nombre,
              COUNT(DISTINCT p.id) AS total_procesos,
              COUNT(DISTINCT CASE WHEN p.estatus = 'Aprobado' THEN p.id END) AS aprobados,
              ROUND(
                COUNT(DISTINCT CASE WHEN p.estatus = 'Aprobado' THEN p.id END) /
                NULLIF(COUNT(DISTINCT p.id), 0) * 100, 1
              ) AS tasa_aprobacion
       FROM consultores c
       JOIN etapa_ejecucion_consultor eec ON eec.consultor_id = c.id
       JOIN etapa_ejecucion ee ON ee.id = eec.etapa_ejecucion_id
       JOIN procesos p ON p.id = ee.proceso_id
       GROUP BY c.id, c.nombre
       HAVING COUNT(DISTINCT p.id) > 0
       ORDER BY tasa_aprobacion DESC`,
      { type: sequelize.QueryTypes.SELECT }
    );

    return res.status(200).json({
      ok: true,
      horasPorConsultor,
      participacionPorEtapa,
      interaccionesUltimos30Dias,
      tasaAprobacionPorConsultor,
    });
  } catch (err) {
    console.error("[reporteConsultores]", err);
    return res.status(500).json({ ok: false, mensaje: "Error en reporte de consultores.", detalle: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 6. CLIENTES
//    GET /reportes/clientes
// ─────────────────────────────────────────────────────────────────────────────
export const reporteClientes = async (req, res) => {
  try {
    // ✅ MySQL: SUM(CASE WHEN) en vez de COUNT FILTER — etapa_propuesta singular
    const topClientesPorActividad = await sequelize.query(
      `SELECT c.id, c.empresa,
              COUNT(DISTINCT pr.id) AS total_proyectos,
              SUM(CASE WHEN pr.activo = 1 THEN 1 ELSE 0 END) AS proyectos_activos,
              COUNT(DISTINCT p.id)  AS total_procesos,
              COUNT(DISTINCT CASE WHEN p.estatus = 'Aprobado' THEN p.id END) AS procesos_aprobados,
              COALESCE(SUM(CASE WHEN p.estatus = 'Aprobado' THEN ep.valor_presupuestado ELSE 0 END), 0) AS valor_total_aprobado
       FROM clientes c
       LEFT JOIN proyectos pr ON pr.cliente_id = c.id
       LEFT JOIN procesos p ON p.proyecto_id = pr.id
       LEFT JOIN etapa_propuesta ep ON ep.proceso_id = p.id
       GROUP BY c.id, c.nombre, c.empresa
       ORDER BY total_proyectos DESC, valor_total_aprobado DESC
       LIMIT 20`,
      { type: sequelize.QueryTypes.SELECT }
    );

    // ✅ MySQL DATE_FORMAT — Cliente tiene timestamps: true → createdAt existe
    const clientesNuevosMes = await Cliente.findAll({
      attributes: [
        [fn("DATE_FORMAT", col("createdAt"), "%Y-%m-01"), "mes"],
        [fn("COUNT", col("id")), "total"],
      ],
      where: { createdAt: { [Op.gte]: literal("DATE_SUB(NOW(), INTERVAL 12 MONTH)") } },
      group:  [literal("DATE_FORMAT(`Cliente`.`createdAt`, '%Y-%m-01')")],
      order:  [[literal("DATE_FORMAT(`Cliente`.`createdAt`, '%Y-%m-01')"), "ASC"]],
      raw: true,
    });

    // ✅ FIX: c.createdAt (camelCase) — clientes tiene timestamps: true
    const sinProyectos = await sequelize.query(
      `SELECT c.id, c.nombre, c.empresa, c.email, c.createdAt
       FROM clientes c
       LEFT JOIN proyectos pr ON pr.cliente_id = c.id
       WHERE pr.id IS NULL
       ORDER BY c.createdAt DESC`,
      { type: sequelize.QueryTypes.SELECT }
    );

    return res.status(200).json({
      ok: true,
      topClientesPorActividad,
      tendenciaClientesNuevos: clientesNuevosMes.map(r => ({ mes: r.mes, total: parseInt(r.total) })),
      resumen: {
        totalClientes:        await Cliente.count(),
        clientesSinProyectos: sinProyectos.length,
      },
      clientesSinProyectos: sinProyectos,
    });
  } catch (err) {
    console.error("[reporteClientes]", err);
    return res.status(500).json({ ok: false, mensaje: "Error en reporte de clientes.", detalle: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 7. HERRAMIENTAS
//    GET /reportes/herramientas
// ─────────────────────────────────────────────────────────────────────────────
export const reporteHerramientas = async (req, res) => {
  try {
    // ✅ Raw SQL con alias real de la tabla (asignacion_herramienta)
    const usoPorHerramienta = await sequelize.query(
      `SELECT ah.herramienta_rpa_id, ah.estado,
              COUNT(ah.id) AS total_asignaciones,
              h.nombre    AS herramienta_nombre,
              h.fabricante, h.version
       FROM asignacion_herramienta ah
       LEFT JOIN herramientas_rpa h ON h.id = ah.herramienta_rpa_id
       GROUP BY ah.herramienta_rpa_id, ah.estado, h.id, h.nombre, h.fabricante, h.version
       ORDER BY total_asignaciones DESC`,
      { type: sequelize.QueryTypes.SELECT }
    );

    // ✅ ORM con alias correcto "herramienta"
    const herramientasEnProcesos = await Proceso.findAll({
      attributes: ["herramienta_rpa_id", [fn("COUNT", col("Proceso.id")), "veces_usado"]],
      where:   { herramienta_rpa_id: { [Op.ne]: null } },
      include: [{ model: HerramientaRpa, as: "herramienta", attributes: ["nombre", "fabricante"] }],
      group:   ["Proceso.herramienta_rpa_id", "herramienta.id", "herramienta.nombre", "herramienta.fabricante"],
      order:   [[fn("COUNT", col("Proceso.id")), "DESC"]],
    });

    const proximasAExpirar = await AsignacionHerramientas.findAll({
      where: {
        estado: "Activa",
        fecha_expiracion: {
          [Op.between]: [new Date(), new Date(Date.now() + 30 * 86400000)],
        },
      },
      include: [
        { model: HerramientaRpa, as: "herramienta", attributes: ["nombre", "fabricante"] },
        { model: Proyecto,       as: "proyecto",    attributes: ["nombre"] },
      ],
      order: [["fecha_expiracion", "ASC"]],
    });

    return res.status(200).json({
      ok: true,
      usoPorHerramienta,
      herramientasEnProcesos,
      proximasAExpirar,
      resumen: {
        totalHerramientas:   await HerramientaRpa.count({ where: { activo: true } }),
        asignacionesActivas: await AsignacionHerramientas.count({ where: { estado: "Activa" } }),
        proximasExpirar:     proximasAExpirar.length,
      },
    });
  } catch (err) {
    console.error("[reporteHerramientas]", err);
    return res.status(500).json({ ok: false, mensaje: "Error en reporte de herramientas.", detalle: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 8. ACTIVIDAD RECIENTE
//    GET /reportes/actividad-reciente
// ─────────────────────────────────────────────────────────────────────────────
export const actividadReciente = async (req, res) => {
  try {
    const { limit = 20 } = req.query;

    const [ultimosEstados, ultimasPropuestas, ultimasAprobaciones, ultimasInteracciones] =
      await Promise.all([

        // ✅ EstadoProyecto tiene timestamps: true → createdAt OK
        EstadoProyecto.findAll({
          limit: +limit,
          order: [["createdAt", "DESC"]],
          include: [
            { model: Proyecto,  attributes: ["nombre"] },
            { model: Consultor, as: "consultor", attributes: ["nombre"] },
          ],
        }),

        // ✅ FIX: EtapaPropuesta tiene timestamps: false → NO existe createdAt.
        //    Se ordena por fecha_entrega_propuesta (campo real del modelo).
        EtapaPropuesta.findAll({
          limit: Math.floor(+limit / 2),
          order: [["fecha_entrega_propuesta", "DESC"]],
          attributes: ["id", "valor_presupuestado", "horas_presupuestadas", "fecha_entrega_propuesta"],
          include: [{
            model: Proceso,
            attributes: ["nombre_proceso", "estatus"],
            include: [{
              model: Proyecto, as: "proyecto",
              attributes: ["nombre"],
              include: [{ model: Cliente, as: "cliente", attributes: ["nombre"] }],
            }],
          }],
        }),

        // ✅ EtapaAprobacion tiene timestamps: false → se ordena por fecha_aprobacion
        EtapaAprobacion.findAll({
          limit: Math.floor(+limit / 2),
          order: [["fecha_aprobacion", "DESC"]],
          attributes: ["id", "aprobado", "fecha_aprobacion", "motivo_rechazo"],
          include: [{
            model: Proceso,
            attributes: ["nombre_proceso"],
            include: [{
              model: Proyecto, as: "proyecto",
              attributes: ["nombre"],
              include: [{ model: Cliente, as: "cliente", attributes: ["empresa"] }],
            }],
          }],
        }),

        // ✅ Interaccion tiene timestamps: false → ordena por fecha (campo del modelo)
        Interaccion.findAll({
          limit: Math.floor(+limit / 2),
          order: [["fecha", "DESC"]],
          include: [
            { model: Consultor, as: "consultor", attributes: ["nombre"] },
            { model: Proceso,   attributes: ["nombre_proceso"] },
          ],
        }),
      ]);

    return res.status(200).json({
      ok: true,
      ultimosCambiosEstadoProyecto: ultimosEstados,
      ultimasPropuestasRegistradas: ultimasPropuestas,
      ultimasDecisionesAprobacion:  ultimasAprobaciones,
      ultimasInteracciones,
    });
  } catch (err) {
    console.error("[actividadReciente]", err);
    return res.status(500).json({ ok: false, mensaje: "Error al obtener actividad reciente.", detalle: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 9. ÁREAS
//    GET /reportes/areas
// ─────────────────────────────────────────────────────────────────────────────
export const reporteAreas = async (req, res) => {
  try {
    // ✅ MySQL CASE WHEN — etapa_propuesta singular, proyecto_area (tabla pivot N:M)
    //    ProyectoArea tableName es "proyecto_area" (sin s)
    const areasPorActividad = await sequelize.query(
      `SELECT a.nombre AS area,
              COUNT(DISTINCT pa.proyecto_id) AS total_proyectos,
              COUNT(DISTINCT p.id)           AS total_procesos,
              COUNT(DISTINCT CASE WHEN p.estatus = 'Aprobado' THEN p.id END) AS procesos_aprobados,
              COALESCE(SUM(CASE WHEN p.estatus = 'Aprobado' THEN ep.valor_presupuestado ELSE 0 END), 0) AS valor_aprobado
       FROM areas a
       LEFT JOIN proyecto_area pa ON pa.area_id = a.id
       LEFT JOIN procesos p ON p.proyecto_id = pa.proyecto_id
       LEFT JOIN etapa_propuesta ep ON ep.proceso_id = p.id
       GROUP BY a.id, a.nombre
       ORDER BY total_proyectos DESC, valor_aprobado DESC`,
      { type: sequelize.QueryTypes.SELECT }
    );

    return res.status(200).json({ ok: true, areasPorActividad });
  } catch (err) {
    console.error("[reporteAreas]", err);
    return res.status(500).json({ ok: false, mensaje: "Error en reporte de áreas.", detalle: err.message });
  }
};

export const reporteForecast = async (req, res) => {
  try {
    const { desde, hasta } = req.query;
    const filtroFecha = rangoFecha(desde, hasta);
    const whereCreado = filtroFecha ? { createdAt: filtroFecha } : {};

    const [pipelinePonderado] = await sequelize.query(
      `SELECT
        COALESCE(SUM(ep.valor_presupuestado * p.probabilidad_aprobacion / 100), 0) AS valor_ponderado,
        COALESCE(SUM(ep.valor_presupuestado), 0) AS valor_bruto,
        COUNT(p.id) AS total_procesos,
        ROUND(AVG(p.probabilidad_aprobacion), 1) AS prob_promedio
       FROM procesos p
       JOIN etapa_propuesta ep ON ep.proceso_id = p.id
       WHERE p.estatus NOT IN ('Aprobado', 'Rechazado', 'Cancelado')
         AND p.probabilidad_aprobacion IS NOT NULL`,
      { type: sequelize.QueryTypes.SELECT }
    );

    const [forecast] = await sequelize.query(
      `SELECT
        COALESCE(SUM(CASE WHEN p.probabilidad_aprobacion >= 75 THEN ep.valor_presupuestado * p.probabilidad_aprobacion / 100 ELSE 0 END), 0) AS dias30,
        COALESCE(SUM(CASE WHEN p.probabilidad_aprobacion >= 50 THEN ep.valor_presupuestado * p.probabilidad_aprobacion / 100 ELSE 0 END), 0) AS dias60,
        COALESCE(SUM(ep.valor_presupuestado * p.probabilidad_aprobacion / 100), 0) AS dias90
       FROM procesos p
       JOIN etapa_propuesta ep ON ep.proceso_id = p.id
       WHERE p.estatus NOT IN ('Aprobado', 'Rechazado', 'Cancelado')
         AND p.probabilidad_aprobacion IS NOT NULL`,
      { type: sequelize.QueryTypes.SELECT }
    );

    const procesosEstancadosAltoRiesgo = await sequelize.query(
      `SELECT p.id, p.nombre_proceso, p.estatus, p.probabilidad_aprobacion,
              DATEDIFF(NOW(), p.updatedAt) AS dias_sin_movimiento,
              ep.valor_presupuestado,
              pr.nombre AS proyecto_nombre,
              c.empresa AS cliente_nombre
       FROM procesos p
       LEFT JOIN etapa_propuesta ep ON ep.proceso_id = p.id
       LEFT JOIN proyectos pr ON pr.id = p.proyecto_id
       LEFT JOIN clientes c ON c.id = pr.cliente_id
       WHERE p.estatus NOT IN ('Aprobado', 'Rechazado', 'Cancelado')
         AND p.probabilidad_aprobacion >= 60
         AND DATEDIFF(NOW(), p.updatedAt) > 14
       ORDER BY dias_sin_movimiento DESC, ep.valor_presupuestado DESC
       LIMIT 10`,
      { type: sequelize.QueryTypes.SELECT }
    );

    const [comparativa] = await sequelize.query(
      `SELECT
        COALESCE(SUM(CASE WHEN DATE_FORMAT(p.createdAt,'%Y-%m') = DATE_FORMAT(NOW(),'%Y-%m') AND p.estatus='Aprobado' THEN ep.valor_presupuestado ELSE 0 END),0) AS valor_mes_actual,
        COALESCE(SUM(CASE WHEN DATE_FORMAT(p.createdAt,'%Y-%m') = DATE_FORMAT(DATE_SUB(NOW(),INTERVAL 1 MONTH),'%Y-%m') AND p.estatus='Aprobado' THEN ep.valor_presupuestado ELSE 0 END),0) AS valor_mes_anterior,
        COALESCE(SUM(CASE WHEN DATE_FORMAT(p.createdAt,'%Y-%m') = DATE_FORMAT(DATE_SUB(NOW(),INTERVAL 1 YEAR),'%Y-%m') AND p.estatus='Aprobado' THEN ep.valor_presupuestado ELSE 0 END),0) AS valor_mismo_mes_anio_ant,
        COUNT(CASE WHEN DATE_FORMAT(p.createdAt,'%Y-%m') = DATE_FORMAT(NOW(),'%Y-%m') THEN p.id END) AS procesos_mes_actual,
        COUNT(CASE WHEN DATE_FORMAT(p.createdAt,'%Y-%m') = DATE_FORMAT(DATE_SUB(NOW(),INTERVAL 1 MONTH),'%Y-%m') THEN p.id END) AS procesos_mes_anterior,
        COUNT(CASE WHEN DATE_FORMAT(p.createdAt,'%Y-%m') = DATE_FORMAT(NOW(),'%Y-%m') AND p.estatus='Aprobado' THEN p.id END) AS aprobados_mes_actual,
        COUNT(CASE WHEN DATE_FORMAT(p.createdAt,'%Y-%m') = DATE_FORMAT(DATE_SUB(NOW(),INTERVAL 1 MONTH),'%Y-%m') AND p.estatus='Aprobado' THEN p.id END) AS aprobados_mes_anterior,
        COUNT(DISTINCT CASE WHEN MONTH(c2.createdAt) = MONTH(NOW()) AND YEAR(c2.createdAt) = YEAR(NOW()) THEN c2.id END) AS clientes_mes_actual,
        COUNT(DISTINCT CASE WHEN MONTH(c2.createdAt) = MONTH(DATE_SUB(NOW(),INTERVAL 1 MONTH)) AND YEAR(c2.createdAt) = YEAR(DATE_SUB(NOW(),INTERVAL 1 MONTH)) THEN c2.id END) AS clientes_mes_anterior
       FROM procesos p
       LEFT JOIN etapa_propuesta ep ON ep.proceso_id = p.id
       CROSS JOIN clientes c2`,
      { type: sequelize.QueryTypes.SELECT }
    );

    const tiempoCierrePorConsultor = await sequelize.query(
      `SELECT c.nombre,
              ROUND(AVG(DATEDIFF(ea.fecha_aprobacion, p.createdAt)), 1) AS dias_promedio_cierre,
              COUNT(DISTINCT p.id) AS procesos_cerrados,
              SUM(CASE WHEN p.estatus = 'Aprobado' THEN 1 ELSE 0 END) AS aprobados,
              ROUND(SUM(CASE WHEN p.estatus='Aprobado' THEN 1 ELSE 0 END) / NULLIF(COUNT(DISTINCT p.id),0) * 100, 1) AS win_rate
       FROM consultores c
       JOIN etapa_ejecucion_consultor eec ON eec.consultor_id = c.id
       JOIN etapa_ejecucion ee ON ee.id = eec.etapa_ejecucion_id
       JOIN procesos p ON p.id = ee.proceso_id
       LEFT JOIN etapa_aprobacion ea ON ea.proceso_id = p.id
       WHERE p.estatus IN ('Aprobado','Rechazado') AND ea.fecha_aprobacion IS NOT NULL
       GROUP BY c.id, c.nombre
       ORDER BY dias_promedio_cierre ASC`,
      { type: sequelize.QueryTypes.SELECT }
    );

    const tiempoCierrePorTipo = await sequelize.query(
      `SELECT p.tipo_proceso,
              ROUND(AVG(DATEDIFF(ea.fecha_aprobacion, p.createdAt)), 1) AS dias_promedio_cierre,
              COUNT(p.id) AS total,
              SUM(CASE WHEN p.estatus='Aprobado' THEN 1 ELSE 0 END) AS aprobados,
              ROUND(SUM(CASE WHEN p.estatus='Aprobado' THEN 1 ELSE 0 END) / NULLIF(COUNT(p.id),0) * 100, 1) AS win_rate
       FROM procesos p
       LEFT JOIN etapa_aprobacion ea ON ea.proceso_id = p.id
       WHERE p.estatus IN ('Aprobado','Rechazado') AND ea.fecha_aprobacion IS NOT NULL
       GROUP BY p.tipo_proceso
       ORDER BY dias_promedio_cierre ASC`,
      { type: sequelize.QueryTypes.SELECT }
    );

    const abandonoPorEtapa = await sequelize.query(
      `SELECT 'Levantamiento' AS etapa,
              (SELECT COUNT(DISTINCT proceso_id) FROM etapa_levantamiento) AS con_etapa,
              (SELECT COUNT(DISTINCT el.proceso_id) FROM etapa_levantamiento el WHERE NOT EXISTS (SELECT 1 FROM etapa_estimacion ee WHERE ee.proceso_id = el.proceso_id)) AS sin_siguiente
       UNION ALL
       SELECT 'Estimación',
              (SELECT COUNT(DISTINCT proceso_id) FROM etapa_estimacion),
              (SELECT COUNT(DISTINCT ee.proceso_id) FROM etapa_estimacion ee WHERE NOT EXISTS (SELECT 1 FROM etapa_propuesta ep WHERE ep.proceso_id = ee.proceso_id))
       UNION ALL
       SELECT 'Propuesta',
              (SELECT COUNT(DISTINCT proceso_id) FROM etapa_propuesta),
              (SELECT COUNT(DISTINCT ep.proceso_id) FROM etapa_propuesta ep WHERE NOT EXISTS (SELECT 1 FROM etapa_aprobacion ea WHERE ea.proceso_id = ep.proceso_id))
       UNION ALL
       SELECT 'Aprobación',
              (SELECT COUNT(DISTINCT proceso_id) FROM etapa_aprobacion),
              (SELECT COUNT(DISTINCT ea.proceso_id) FROM etapa_aprobacion ea WHERE ea.aprobado = 0)`,
      { type: sequelize.QueryTypes.SELECT }
    );

    const valorMesActual = parseFloat(comparativa?.valor_mes_actual ?? 0);
    const valorMesAnterior = parseFloat(comparativa?.valor_mes_anterior ?? 0);
    const valorMismoMesAnioAnt = parseFloat(comparativa?.valor_mismo_mes_anio_ant ?? 0);

    return res.status(200).json({
      ok: true,
      pipelinePonderado: {
        valorPonderado: parseFloat(pipelinePonderado?.valor_ponderado ?? 0),
        valorBruto:     parseFloat(pipelinePonderado?.valor_bruto    ?? 0),
        totalProcesos:  parseInt(pipelinePonderado?.total_procesos   ?? 0),
        probPromedio:   parseFloat(pipelinePonderado?.prob_promedio  ?? 0),
      },
      forecastDias: {
        dias30: parseFloat(forecast?.dias30 ?? 0),
        dias60: parseFloat(forecast?.dias60 ?? 0),
        dias90: parseFloat(forecast?.dias90 ?? 0),
      },
      procesosEstancadosAltoRiesgo,
      comparativaMensual: {
        valorMesActual,
        valorMesAnterior,
        valorMismoMesAnioAnt,
        crecimientoMoM:  valorMesAnterior > 0 ? pct(valorMesActual - valorMesAnterior, valorMesAnterior) : null,
        crecimientoYoY:  valorMismoMesAnioAnt > 0 ? pct(valorMesActual - valorMismoMesAnioAnt, valorMismoMesAnioAnt) : null,
        procesosActual:   parseInt(comparativa?.procesos_mes_actual  ?? 0),
        procesosAnterior: parseInt(comparativa?.procesos_mes_anterior ?? 0),
        aprobadosActual:  parseInt(comparativa?.aprobados_mes_actual  ?? 0),
        aprobadosAnterior:parseInt(comparativa?.aprobados_mes_anterior ?? 0),
        clientesActual:   parseInt(comparativa?.clientes_mes_actual   ?? 0),
        clientesAnterior: parseInt(comparativa?.clientes_mes_anterior ?? 0),
      },
      tiempoCierrePorConsultor,
      tiempoCierrePorTipo,
      abandonoPorEtapa: abandonoPorEtapa.map(r => ({
        etapa:       r.etapa,
        conEtapa:    parseInt(r.con_etapa    ?? 0),
        sinSiguiente:parseInt(r.sin_siguiente ?? 0),
        pctAbandono: r.con_etapa > 0 ? pct(parseInt(r.sin_siguiente ?? 0), parseInt(r.con_etapa ?? 0)) : 0,
      })),
    });
  } catch (err) {
    console.error("[reporteForecast]", err);
    return res.status(500).json({ ok: false, mensaje: "Error en reporte de forecast.", detalle: err.message });
  }
};

export const reporteSaludClientes = async (req, res) => {
  try {
    const churnSilencioso = await sequelize.query(
      `SELECT c.id, c.nombre, c.empresa, c.email,
              MAX(i.fecha) AS ultima_interaccion,
              DATEDIFF(NOW(), COALESCE(MAX(i.fecha), c.createdAt)) AS dias_sin_contacto,
              COUNT(DISTINCT pr.id) AS total_proyectos,
              COUNT(DISTINCT CASE WHEN pr.activo = 1 THEN pr.id END) AS proyectos_activos
       FROM clientes c
       LEFT JOIN proyectos pr ON pr.cliente_id = c.id
       LEFT JOIN procesos p ON p.proyecto_id = pr.id
       LEFT JOIN interaccion i ON i.proceso_id = p.id
       GROUP BY c.id, c.nombre, c.empresa, c.email, c.createdAt
       HAVING dias_sin_contacto > 90 OR ultima_interaccion IS NULL
       ORDER BY dias_sin_contacto DESC
       LIMIT 20`,
      { type: sequelize.QueryTypes.SELECT }
    );

    const activosSinInteraccion = await sequelize.query(
      `SELECT c.id, c.nombre, c.empresa,
              MAX(i.fecha) AS ultima_interaccion,
              DATEDIFF(NOW(), MAX(i.fecha)) AS dias_sin_contacto,
              COUNT(DISTINCT pr.id) AS proyectos_activos
       FROM clientes c
       JOIN proyectos pr ON pr.cliente_id = c.id AND pr.activo = 1
       LEFT JOIN procesos p ON p.proyecto_id = pr.id
       LEFT JOIN interaccion i ON i.proceso_id = p.id
       GROUP BY c.id, c.nombre, c.empresa
       HAVING ultima_interaccion IS NULL OR dias_sin_contacto > 30
       ORDER BY dias_sin_contacto DESC
       LIMIT 15`,
      { type: sequelize.QueryTypes.SELECT }
    );

    const frecuenciaInteraccion = await sequelize.query(
      `SELECT c.id, c.nombre, c.empresa,
              COUNT(i.id) AS total_interacciones,
              ROUND(COUNT(i.id) / GREATEST(DATEDIFF(NOW(), c.createdAt) / 30, 1), 2) AS interacciones_por_mes,
              MAX(i.fecha) AS ultima_interaccion
       FROM clientes c
       LEFT JOIN proyectos pr ON pr.cliente_id = c.id
       LEFT JOIN procesos p ON p.proyecto_id = pr.id
       LEFT JOIN interaccion i ON i.proceso_id = p.id
       GROUP BY c.id, c.nombre, c.empresa, c.createdAt
       ORDER BY interacciones_por_mes DESC
       LIMIT 20`,
      { type: sequelize.QueryTypes.SELECT }
    );

    const ltvPorCliente = await sequelize.query(
      `SELECT c.id, c.nombre, c.empresa,
              COALESCE(SUM(CASE WHEN p.estatus='Aprobado' THEN ep.valor_presupuestado ELSE 0 END), 0) AS ltv,
              COALESCE(SUM(CASE WHEN p.estatus='Aprobado' THEN ep.horas_presupuestadas ELSE 0 END), 0) AS horas_aprobadas,
              COUNT(DISTINCT CASE WHEN p.estatus='Aprobado' THEN p.id END) AS procesos_aprobados,
              COUNT(DISTINCT pr.id) AS total_proyectos,
              MIN(p.createdAt) AS primer_proceso,
              MAX(CASE WHEN p.estatus='Aprobado' THEN p.createdAt END) AS ultimo_proceso_aprobado
       FROM clientes c
       LEFT JOIN proyectos pr ON pr.cliente_id = c.id
       LEFT JOIN procesos p ON p.proyecto_id = pr.id
       LEFT JOIN etapa_propuesta ep ON ep.proceso_id = p.id
       GROUP BY c.id, c.nombre, c.empresa
       ORDER BY ltv DESC
       LIMIT 20`,
      { type: sequelize.QueryTypes.SELECT }
    );

    const totalClientes = await Cliente.count();

    return res.status(200).json({
      ok: true,
      churnSilencioso,
      activosSinInteraccion,
      frecuenciaInteraccion,
      ltvPorCliente,
      resumen: {
        totalClientes,
        clientesEnRiesgoChurn:      churnSilencioso.length,
        activosSinContactoReciente: activosSinInteraccion.length,
        ltvTotalPortafolio:         ltvPorCliente.reduce((a, r) => a + parseFloat(r.ltv ?? 0), 0),
        ltvPromedio:                totalClientes > 0
          ? ltvPorCliente.reduce((a, r) => a + parseFloat(r.ltv ?? 0), 0) / totalClientes
          : 0,
      },
    });
  } catch (err) {
    console.error("[reporteSaludClientes]", err);
    return res.status(500).json({ ok: false, mensaje: "Error en reporte de salud de clientes.", detalle: err.message });
  }
};

export const reporteCapacidad = async (req, res) => {
  try {
    const cargaPorConsultor = await sequelize.query(
      `SELECT c.id, c.nombre, c.rol, c.activo,
              COUNT(DISTINCT CASE WHEN p.estatus NOT IN ('Aprobado','Rechazado','Cancelado') THEN ee.proceso_id END) AS procesos_activos,
              COALESCE(SUM(CASE WHEN p.estatus NOT IN ('Aprobado','Rechazado','Cancelado') THEN ep.horas_presupuestadas ELSE 0 END), 0) AS horas_comprometidas,
              COALESCE(SUM(ee.horas_reales), 0) AS horas_ejecutadas_total
       FROM consultores c
       LEFT JOIN etapa_ejecucion_consultor eec ON eec.consultor_id = c.id
       LEFT JOIN etapa_ejecucion ee ON ee.id = eec.etapa_ejecucion_id
       LEFT JOIN procesos p ON p.id = ee.proceso_id
       LEFT JOIN etapa_propuesta ep ON ep.proceso_id = p.id
       GROUP BY c.id, c.nombre, c.rol, c.activo
       ORDER BY horas_comprometidas DESC`,
      { type: sequelize.QueryTypes.SELECT }
    );

    const procesosEstancados = await sequelize.query(
      `SELECT p.id, p.nombre_proceso, p.estatus, p.tipo_proceso,
              DATEDIFF(NOW(), p.updatedAt) AS dias_estancado,
              ep.valor_presupuestado,
              pr.nombre AS proyecto_nombre,
              c.empresa AS cliente_nombre
       FROM procesos p
       LEFT JOIN etapa_propuesta ep ON ep.proceso_id = p.id
       LEFT JOIN proyectos pr ON pr.id = p.proyecto_id
       LEFT JOIN clientes c ON c.id = pr.cliente_id
       WHERE p.estatus NOT IN ('Aprobado','Rechazado','Cancelado','Completado')
         AND DATEDIFF(NOW(), p.updatedAt) > 30
       ORDER BY dias_estancado DESC
       LIMIT 20`,
      { type: sequelize.QueryTypes.SELECT }
    );

    const winRatePorTipo = await sequelize.query(
      `SELECT tipo_proceso,
              COUNT(*) AS total,
              SUM(CASE WHEN estatus='Aprobado' THEN 1 ELSE 0 END) AS aprobados,
              ROUND(SUM(CASE WHEN estatus='Aprobado' THEN 1 ELSE 0 END) / NULLIF(COUNT(*),0) * 100, 1) AS win_rate
       FROM procesos
       WHERE estatus IN ('Aprobado','Rechazado')
       GROUP BY tipo_proceso
       ORDER BY win_rate DESC`,
      { type: sequelize.QueryTypes.SELECT }
    );

    const winRatePorCliente = await sequelize.query(
      `SELECT c.nombre AS cliente, c.empresa,
              COUNT(DISTINCT p.id) AS total_procesos,
              COUNT(DISTINCT CASE WHEN p.estatus='Aprobado' THEN p.id END) AS aprobados,
              ROUND(COUNT(DISTINCT CASE WHEN p.estatus='Aprobado' THEN p.id END) / NULLIF(COUNT(DISTINCT p.id),0) * 100, 1) AS win_rate,
              COALESCE(SUM(CASE WHEN p.estatus='Aprobado' THEN ep.valor_presupuestado ELSE 0 END),0) AS valor_ganado
       FROM clientes c
       JOIN proyectos pr ON pr.cliente_id = c.id
       JOIN procesos p ON p.proyecto_id = pr.id
       LEFT JOIN etapa_propuesta ep ON ep.proceso_id = p.id
       WHERE p.estatus IN ('Aprobado','Rechazado')
       GROUP BY c.id, c.nombre, c.empresa
       HAVING COUNT(DISTINCT p.id) >= 2
       ORDER BY win_rate DESC
       LIMIT 15`,
      { type: sequelize.QueryTypes.SELECT }
    );

    const razonesRechazo = await sequelize.query(
      `SELECT motivo_rechazo, COUNT(*) AS total
       FROM etapa_aprobacion
       WHERE aprobado = 0 AND motivo_rechazo IS NOT NULL AND motivo_rechazo != ''
       GROUP BY motivo_rechazo
       ORDER BY total DESC
       LIMIT 10`,
      { type: sequelize.QueryTypes.SELECT }
    );

    const margenRealPorProceso = await sequelize.query(
      `SELECT p.nombre_proceso, p.tipo_proceso,
              ep.valor_presupuestado,
              ep.horas_presupuestadas,
              ee.horas_reales,
              CASE
                WHEN p.tipo_proceso = 'Desarrollo' THEN c.precio_hora_desarrollo
                WHEN p.tipo_proceso = 'Soporte'    THEN c.precio_hora_soporte
                ELSE c.precio_hora_desarrollo
              END AS precio_hora,
              CASE
                WHEN p.tipo_proceso = 'Desarrollo' THEN
                  ROUND(ep.valor_presupuestado - (ee.horas_reales * c.precio_hora_desarrollo), 2)
                WHEN p.tipo_proceso = 'Soporte' THEN
                  ROUND(ep.valor_presupuestado - (ee.horas_reales * c.precio_hora_soporte), 2)
                ELSE
                  ROUND(ep.valor_presupuestado - (ee.horas_reales * c.precio_hora_desarrollo), 2)
              END AS margen_real
       FROM procesos p
       JOIN etapa_propuesta ep ON ep.proceso_id = p.id
       JOIN etapa_ejecucion ee ON ee.proceso_id = p.id
       JOIN proyectos pr ON pr.id = p.proyecto_id
       JOIN clientes c ON c.id = pr.cliente_id
       WHERE p.estatus = 'Aprobado'
         AND ee.horas_reales IS NOT NULL
         AND ep.valor_presupuestado IS NOT NULL
       ORDER BY margen_real ASC
       LIMIT 20`,
      { type: sequelize.QueryTypes.SELECT }
    );

    const totalConsultores = await Consultor.count();
    const sobrecargados = cargaPorConsultor.filter(c => parseFloat(c.horas_comprometidas ?? 0) > 160).length;
    const sinAsignacion = cargaPorConsultor.filter(c => parseInt(c.procesos_activos ?? 0) === 0).length;

    return res.status(200).json({
      ok: true,
      cargaPorConsultor,
      procesosEstancados,
      winRatePorTipo,
      winRatePorCliente,
      razonesRechazo,
      margenRealPorProceso,
      resumen: {
        totalConsultores,
        consultoresSobrecargados: sobrecargados,
        consultoresSinAsignacion: sinAsignacion,
        procesosEstancadosTotal:  procesosEstancados.length,
      },
    });
  } catch (err) {
    console.error("[reporteCapacidad]", err);
    return res.status(500).json({ ok: false, mensaje: "Error en reporte de capacidad.", detalle: err.message });
  }
};