import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const InteraccionPropuestaConsultor = sequelize.define("InteraccionPropuestaConsultor", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  interaccion_propuesta_id: {
    type: DataTypes.UUID, allowNull: false,
    references: { model: "interaccion_propuesta", key: "id" },
    onDelete: "CASCADE"
  },
  consultor_id: {
    type: DataTypes.UUID, allowNull: false,
    references: { model: "consultores", key: "id" },
    onDelete: "CASCADE"
  },
}, {
  tableName: "interaccion_propuesta_consultor",
  timestamps: false,
  indexes: [{ unique: true, name: "uniq_ipc_inter_cons", fields: ["interaccion_propuesta_id", "consultor_id"] }]
});