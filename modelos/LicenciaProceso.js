import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const LicenciaProceso = sequelize.define("LicenciaProceso", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  licencia_id: { type: DataTypes.UUID, allowNull: false, references: { model: "licencias", key: "id" } },
  proceso_id: { type: DataTypes.UUID, allowNull: false, references: { model: "procesos", key: "id" } },
}, { tableName: "licencia_proceso", timestamps: false });