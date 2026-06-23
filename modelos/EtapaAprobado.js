import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const EtapaAprobado = sequelize.define("EtapaAprobado", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  proceso_id: {
    type: DataTypes.UUID, allowNull: false,
    references: { model: "procesos", key: "id" },
    onDelete: "CASCADE", onUpdate: "CASCADE"
  },
  fecha_aprobado:  { type: DataTypes.DATE,    allowNull: true },
  observaciones:   { type: DataTypes.TEXT,    allowNull: true },
  proximos_pasos:  { type: DataTypes.TEXT,    allowNull: true },
  estado_id: {
    type: DataTypes.UUID, allowNull: true,
    references: { model: "estados", key: "id" }
  },
}, { tableName: "etapa_aprobado", timestamps: false });