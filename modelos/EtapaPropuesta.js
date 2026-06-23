import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const EtapaPropuesta = sequelize.define("EtapaPropuesta", {

  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },

  proceso_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "procesos",
      key: "id"
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
  },

  nivel_detalle: {
    type: DataTypes.STRING
  },

  fecha_entrega_propuesta: {
    type: DataTypes.DATE
  },

  valor_presupuestado: {
    type: DataTypes.DECIMAL
  },

  horas_presupuestadas: {
    type: DataTypes.INTEGER
  },
  horas_gerencia: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  valor_gerencia: {
    type: DataTypes.DECIMAL,
    allowNull: true,
  },
  observaciones: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  hito_inicio_pct: { type: DataTypes.DECIMAL, allowNull: true, defaultValue: 30 },
  hito_pruebas_pct: { type: DataTypes.DECIMAL, allowNull: true, defaultValue: 50 },
  hito_estabilizacion_pct: { type: DataTypes.DECIMAL, allowNull: true, defaultValue: 20 },
  lic_forma_pago: { type: DataTypes.STRING, allowNull: true },
  ocr_forma_pago: { type: DataTypes.STRING, allowNull: true },
  captcha_forma_pago: { type: DataTypes.STRING, allowNull: true },
  soporte_forma_pago: { type: DataTypes.STRING, allowNull: true },
  idp_forma_pago: { type: DataTypes.STRING, allowNull: true },
  ia_forma_pago: { type: DataTypes.STRING, allowNull: true },
}, {
  tableName: "etapa_propuesta",
  timestamps: false
});
