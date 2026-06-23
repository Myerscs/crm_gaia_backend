import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const InteraccionFacturado = sequelize.define("InteraccionFacturado", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  etapa_facturado_id: {
    type: DataTypes.UUID, allowNull: false,
    references: { model: "etapa_facturado", key: "id" },
    onDelete: "CASCADE", onUpdate: "CASCADE"
  },
  fecha:          { type: DataTypes.DATE, allowNull: false },
  observaciones:  { type: DataTypes.TEXT, allowNull: true },
  proximos_pasos: { type: DataTypes.TEXT, allowNull: true },
  estado_id: {
    type: DataTypes.UUID, allowNull: true,
    references: { model: "estados", key: "id" }
  },
}, { tableName: "interaccion_facturado", timestamps: false });