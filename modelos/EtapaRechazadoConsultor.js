import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const EtapaRechazadoConsultor = sequelize.define("EtapaRechazadoConsultor", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  etapa_rechazado_id: {
    type: DataTypes.UUID, allowNull: false,
    references: { model: "etapa_rechazado", key: "id" },
    onDelete: "CASCADE", onUpdate: "CASCADE"
  },
  consultor_id: {
    type: DataTypes.UUID, allowNull: false,
    references: { model: "consultores", key: "id" },
    onDelete: "CASCADE", onUpdate: "CASCADE"
  },
}, {
  tableName: "etapa_rechazado_consultor",
  timestamps: false,
  indexes: [{ unique: true, name: "uniq_rechazado_cons", fields: ["etapa_rechazado_id", "consultor_id"] }]
});