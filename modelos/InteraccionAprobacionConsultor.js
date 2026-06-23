import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const InteraccionAprobacionConsultor = sequelize.define("InteraccionAprobacionConsultor", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  interaccion_aprobacion_id: {
    type: DataTypes.UUID, allowNull: false,
    references: { model: "interaccion_aprobacion", key: "id" },
    onDelete: "CASCADE"
  },
  consultor_id: {
    type: DataTypes.UUID, allowNull: false,
    references: { model: "consultores", key: "id" },
    onDelete: "CASCADE"
  },
}, {
  tableName: "interaccion_aprobacion_consultor",
  timestamps: false,
  indexes: [{ unique: true, name: "uniq_iac_inter_cons", fields: ["interaccion_aprobacion_id", "consultor_id"] }]
});