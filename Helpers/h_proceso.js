import {
  Proyecto, Cliente, HerramientaRpa, Consultor,
  EtapaLevantamiento, InteraccionLevantamiento,
  EtapaEstimacion, InteraccionEstimacion,
  EtapaPropuesta,
  EtapaPreliminar,
  EtapaAprobacion, InteraccionAprobacion,
  EtapaAprobado, InteraccionAprobado,
  EtapaEjecucion, InteraccionEjecucion,
  EtapaCierre, InteraccionCierre,
  EtapaFacturado, InteraccionFacturado,
  Interaccion, Estados,
  EtapaRechazado, InteraccionRechazado,
  EtapaStandBy, InteraccionStandBy,
  EtapaFacturadoItem,
} from "../modelos/relations.js";

export const TIPOS_INTERACCION = ["Llamada", "Correo", "Reunión", "Visita", "Otro"];

const cons = {
  model: Consultor, as: "consultores",
  attributes: ["id", "nombre"], through: { attributes: [] },
};

const ints = (Model) => ({
  model: Model, as: "interacciones",
  separate: true,
  attributes: ["id", "fecha", "observaciones", "proximos_pasos", "estado_id"],
  include: [
    { model: Consultor, as: "consultores", attributes: ["id", "nombre"], through: { attributes: [] } },
    { model: Estados, as: "estadoObj", attributes: ["id", "nombre"] },
  ],
});

export const INCLUDE_PROCESO_LIST = [
  {
    model: Proyecto, as: "proyecto", attributes: ["id", "nombre"],
    include: [{ model: Cliente, as: "cliente", attributes: ["id", "empresa"] }],
  },
  { model: HerramientaRpa, as: "herramientas", attributes: ["id", "nombre"], through: { attributes: [] } },
  { model: Estados, as: "estadoObj", attributes: ["id", "nombre"] },
  {
    model: EtapaPropuesta, as: "propuesta",
    attributes: ["id", "valor_presupuestado", "horas_presupuestadas"]
  },
  {
    model: EtapaRechazado, as: "rechazado",
    attributes: ["id", "fecha_rechazo", "motivo_categoria", "recuperable", "estado_id"]
  },
  {
    model: EtapaStandBy, as: "stand_by",
    attributes: ["id", "fecha_inicio_pausa", "fecha_estimada_retorno", "motivo_categoria", "estado_id"]
  },
];

export const INCLUDE_PROCESO = [
  {
    model: Proyecto, as: "proyecto", attributes: ["id", "nombre"],
    include: [{ model: Cliente, as: "cliente", attributes: ["id", "empresa"] }],
  },
  {
    model: HerramientaRpa, as: "herramientas",
    attributes: ["id", "nombre", "fabricante"], through: { attributes: [] },
  },
  { model: Estados, as: "estadoObj", attributes: ["id", "nombre"] },

  {
    model: EtapaLevantamiento, as: "levantamiento",
    attributes: ["id", "fecha_levantamiento", "observaciones", "proximos_pasos", "estado_id"],
    include: [cons, ints(InteraccionLevantamiento)]
  },

  {
    model: EtapaEstimacion, as: "estimacion",
    attributes: [
      "id", "fecha_estimacion", "observaciones", "proximos_pasos", "estado_id",
      "volumen_transaccional_mensual", "tiempo_ejecucion_transaccion",
      "requiere_captcha", "volumen_captcha_mes", "costo_mensual_captcha",
      "requiere_ai", "ai_para_que", "ai_nombre",
      "ai_metodo_pago", "ai_volumen_mensual_tokens", "costo_mensual_ai",
      "requiere_ocr", "ocr_nombre", "ocr_volumen_mensual", "ocr_costo",
      "requiere_idp", "idp_documentos", "idp_volumen_mensual", "costo_mensual_idp",
    ],
    include: [cons, ints(InteraccionEstimacion)]
  },

  { model: EtapaPropuesta, as: "propuesta",
  attributes: [
    "id", "nivel_detalle", "fecha_entrega_propuesta",
    "valor_presupuestado", "horas_presupuestadas",
    "horas_gerencia", "valor_gerencia",
    "observaciones", "estado_id",
    "hito_inicio_pct", "hito_pruebas_pct", "hito_estabilizacion_pct",
    "lic_forma_pago", "ocr_forma_pago", "captcha_forma_pago",
    "soporte_forma_pago", "idp_forma_pago", "ia_forma_pago",
  ],
  include: [cons]
},

  {
    model: EtapaPreliminar, as: "preliminar",
    attributes: ["id", "fecha_preliminar", "resultado", "probabilidad", "observaciones"],
    include: [cons]
  },

  {
    model: EtapaAprobacion, as: "aprobacion",
    attributes: ["id", "aprobado", "fecha_aprobacion", "motivo_rechazo", "observaciones", "estado_id"],
    include: [cons, ints(InteraccionAprobacion)]
  },

  {
    model: EtapaAprobado, as: "aprobado",
    attributes: ["id", "fecha_aprobado", "observaciones", "proximos_pasos", "estado_id"],
    include: [cons, ints(InteraccionAprobado)]
  },

  {
    model: EtapaEjecucion, as: "ejecucion",
    attributes: ["id", "fecha_inicio", "fecha_fin", "observaciones", "proximos_pasos", "estado_id"],
    include: [cons, ints(InteraccionEjecucion)]
  },

  {
    model: EtapaCierre, as: "cierre",
    attributes: ["id", "fecha_cierre", "observaciones", "proximos_pasos", "estado_id" , "horas_reales"],
    include: [cons, ints(InteraccionCierre)]
  },

  {
    model: EtapaFacturado, as: "facturado",
    attributes: ["id", "observaciones", "proximos_pasos", "estado_id"],
    include: [
      cons,
      ints(InteraccionFacturado),
      {
        model: EtapaFacturadoItem, as: "facturas",
        attributes: ["id", "nombre", "numero_factura", "fecha_factura",
          "dias_credito", "fecha_vencimiento", "valor_facturado", "estado_cobro"]
      }
    ]
  },
  {
    model: Interaccion, as: "interacciones",
    separate: true,
    include: [{ model: Consultor, as: "consultor", attributes: ["id", "nombre"] }]
  },

  {
    model: EtapaRechazado, as: "rechazado",
    include: [cons, ints(InteraccionRechazado)]
  },

  {
    model: EtapaStandBy, as: "stand_by",
    include: [cons, ints(InteraccionStandBy)]
  },
];