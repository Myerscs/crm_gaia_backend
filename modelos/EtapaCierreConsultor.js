import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const EtapaCierreConsultor = sequelize.define("EtapaCierreConsultor", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  etapa_cierre_id: {
    type: DataTypes.UUID, allowNull: false,
    references: { model: "etapa_cierre", key: "id" },
    onDelete: "CASCADE", onUpdate: "CASCADE"
  },
  consultor_id: {
    type: DataTypes.UUID, allowNull: false,
    references: { model: "consultores", key: "id" },
    onDelete: "CASCADE", onUpdate: "CASCADE"
  },
}, {
  tableName: "etapa_cierre_consultor",
  timestamps: false,
  indexes: [{ unique: true, name: "uniq_cierre_cons", fields: ["etapa_cierre_id", "consultor_id"] }]
});