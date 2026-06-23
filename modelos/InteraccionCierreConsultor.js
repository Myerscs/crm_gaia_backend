import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const InteraccionCierreConsultor = sequelize.define("InteraccionCierreConsultor", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  interaccion_cierre_id: {
    type: DataTypes.UUID, allowNull: false,
    references: { model: "interaccion_cierre", key: "id" },
    onDelete: "CASCADE"
  },
  consultor_id: {
    type: DataTypes.UUID, allowNull: false,
    references: { model: "consultores", key: "id" },
    onDelete: "CASCADE"
  },
}, {
  tableName: "interaccion_cierre_consultor",
  timestamps: false,
  indexes: [{ unique: true, name: "uniq_icierre_cons", fields: ["interaccion_cierre_id", "consultor_id"] }]
});