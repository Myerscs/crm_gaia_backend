import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const InteraccionRechazadoConsultor = sequelize.define("InteraccionRechazadoConsultor", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  interaccion_rechazado_id: {
    type: DataTypes.UUID, allowNull: false,
    references: { model: "interaccion_rechazado", key: "id" },
    onDelete: "CASCADE"
  },
  consultor_id: {
    type: DataTypes.UUID, allowNull: false,
    references: { model: "consultores", key: "id" },
    onDelete: "CASCADE"
  },
}, {
  tableName: "interaccion_rechazado_consultor",
  timestamps: false,
  indexes: [{ unique: true, name: "uniq_irechazado_cons", fields: ["interaccion_rechazado_id", "consultor_id"] }]
});