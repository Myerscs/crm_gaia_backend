import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const EtapaAprobadoConsultor = sequelize.define("EtapaAprobadoConsultor", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  etapa_aprobado_id: {
    type: DataTypes.UUID, allowNull: false,
    references: { model: "etapa_aprobado", key: "id" },
    onDelete: "CASCADE", onUpdate: "CASCADE"
  },
  consultor_id: {
    type: DataTypes.UUID, allowNull: false,
    references: { model: "consultores", key: "id" },
    onDelete: "CASCADE", onUpdate: "CASCADE"
  },
}, {
  tableName: "etapa_aprobado_consultor",
  timestamps: false,
  indexes: [{ unique: true, name: "uniq_aprobado_cons", fields: ["etapa_aprobado_id", "consultor_id"] }]
});