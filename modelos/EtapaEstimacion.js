import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const EtapaEstimacion = sequelize.define("EtapaEstimacion", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },

  proceso_id: {
    type: DataTypes.UUID, allowNull: false,
    references: { model: "procesos", key: "id" },
    onDelete: "CASCADE", onUpdate: "CASCADE",
  },

  fecha_estimacion: { type: DataTypes.DATE, allowNull: true },
  observaciones:    { type: DataTypes.TEXT, allowNull: true },
  proximos_pasos:   { type: DataTypes.TEXT, allowNull: true },

  estado_id: {
    type: DataTypes.UUID, allowNull: true,
    references: { model: "estados", key: "id" },
  },

  volumen_transaccional_mensual: { type: DataTypes.INTEGER,      allowNull: true },
  tiempo_ejecucion_transaccion:  { type: DataTypes.DECIMAL(10,2), allowNull: true },

  requiere_captcha:    { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
  volumen_captcha_mes: { type: DataTypes.INTEGER, allowNull: true },
  costo_mensual_captcha: { type: DataTypes.DECIMAL(12,2), allowNull: true },

  requiere_ai:               { type: DataTypes.BOOLEAN,     allowNull: true, defaultValue: false },
  ai_para_que:               { type: DataTypes.TEXT,        allowNull: true },
  ai_nombre:                 { type: DataTypes.STRING(120), allowNull: true },
  ai_metodo_pago:            { type: DataTypes.STRING(80),  allowNull: true },
  ai_volumen_mensual_tokens: { type: DataTypes.INTEGER,     allowNull: true },
  costo_mensual_ai:          { type: DataTypes.DECIMAL(12,2), allowNull: true },

  requiere_ocr:        { type: DataTypes.BOOLEAN,     allowNull: true, defaultValue: false },
  ocr_nombre:          { type: DataTypes.STRING(120), allowNull: true },
  ocr_volumen_mensual: { type: DataTypes.INTEGER,     allowNull: true },
  ocr_costo:           { type: DataTypes.DECIMAL(12,2), allowNull: true },

  requiere_idp:        { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
  idp_documentos:      { type: DataTypes.TEXT,    allowNull: true },
  idp_volumen_mensual: { type: DataTypes.INTEGER, allowNull: true },
  costo_mensual_idp:   { type: DataTypes.DECIMAL(12,2), allowNull: true },

}, { tableName: "etapa_estimacion", timestamps: true });