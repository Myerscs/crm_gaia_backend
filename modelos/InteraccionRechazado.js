import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const InteraccionRechazado = sequelize.define("InteraccionRechazado", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  etapa_rechazado_id: {
    type: DataTypes.UUID, allowNull: false,
    references: { model: "etapa_rechazado", key: "id" },
    onDelete: "CASCADE", onUpdate: "CASCADE"
  },
  fecha:          { type: DataTypes.DATE, allowNull: false },
  observaciones:  { type: DataTypes.TEXT, allowNull: true },
  proximos_pasos: { type: DataTypes.TEXT, allowNull: true },
  estado_id: {
    type: DataTypes.UUID, allowNull: true,
    references: { model: "estados", key: "id" }
  },
}, { tableName: "interaccion_rechazado", timestamps: false });