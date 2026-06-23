import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const InteraccionEjecucionConsultor = sequelize.define("InteraccionEjecucionConsultor", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  interaccion_ejecucion_id: {
    type: DataTypes.UUID, allowNull: false,
    references: { model: "interaccion_ejecucion", key: "id" },
    onDelete: "CASCADE"
  },
  consultor_id: {
    type: DataTypes.UUID, allowNull: false,
    references: { model: "consultores", key: "id" },
    onDelete: "CASCADE"
  },
}, {
  tableName: "interaccion_ejecucion_consultor",
  timestamps: false,
  indexes: [{ unique: true, name: "uniq_iejec_cons", fields: ["interaccion_ejecucion_id", "consultor_id"] }]
});