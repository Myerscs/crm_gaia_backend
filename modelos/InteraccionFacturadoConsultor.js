import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const InteraccionFacturadoConsultor = sequelize.define("InteraccionFacturadoConsultor", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  interaccion_facturado_id: {
    type: DataTypes.UUID, allowNull: false,
    references: { model: "interaccion_facturado", key: "id" },
    onDelete: "CASCADE"
  },
  consultor_id: {
    type: DataTypes.UUID, allowNull: false,
    references: { model: "consultores", key: "id" },
    onDelete: "CASCADE"
  },
}, {
  tableName: "interaccion_facturado_consultor",
  timestamps: false,
  indexes: [{ unique: true, name: "uniq_ifacturado_cons", fields: ["interaccion_facturado_id", "consultor_id"] }]
});