import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const EtapaFacturadoConsultor = sequelize.define("EtapaFacturadoConsultor", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  etapa_facturado_id: {
    type: DataTypes.UUID, allowNull: false,
    references: { model: "etapa_facturado", key: "id" },
    onDelete: "CASCADE", onUpdate: "CASCADE"
  },
  consultor_id: {
    type: DataTypes.UUID, allowNull: false,
    references: { model: "consultores", key: "id" },
    onDelete: "CASCADE", onUpdate: "CASCADE"
  },
}, {
  tableName: "etapa_facturado_consultor",
  timestamps: false,
  indexes: [{ unique: true, name: "uniq_facturado_cons", fields: ["etapa_facturado_id", "consultor_id"] }]
});