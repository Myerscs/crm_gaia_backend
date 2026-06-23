import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const EtapaCierre = sequelize.define("EtapaCierre", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  proceso_id: {
    type: DataTypes.UUID, allowNull: false,
    references: { model: "procesos", key: "id" },
    onDelete: "CASCADE", onUpdate: "CASCADE"
  },
  fecha_cierre:   { type: DataTypes.DATE, allowNull: true },
  observaciones:  { type: DataTypes.TEXT, allowNull: true },
  proximos_pasos: { type: DataTypes.TEXT, allowNull: true },
  estado_id: {
    type: DataTypes.UUID, allowNull: true,
    references: { model: "estados", key: "id" }
  },
  horas_reales: { type: DataTypes.INTEGER, allowNull: true },
}, { tableName: "etapa_cierre", timestamps: false });