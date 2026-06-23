import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const InteraccionAprobadoConsultor = sequelize.define("InteraccionAprobadoConsultor", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  interaccion_aprobado_id: {
    type: DataTypes.UUID, allowNull: false,
    references: { model: "interaccion_aprobado", key: "id" },
    onDelete: "CASCADE"
  },
  consultor_id: {
    type: DataTypes.UUID, allowNull: false,
    references: { model: "consultores", key: "id" },
    onDelete: "CASCADE"
  },
}, {
  tableName: "interaccion_aprobado_consultor",
  timestamps: false,
  indexes: [{ unique: true, name: "uniq_iaprobado_cons", fields: ["interaccion_aprobado_id", "consultor_id"] }]
});