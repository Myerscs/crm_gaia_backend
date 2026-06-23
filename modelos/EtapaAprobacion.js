import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const EtapaAprobacion = sequelize.define("EtapaAprobacion", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  proceso_id: {
    type: DataTypes.UUID, allowNull: false,
    references: { model: "procesos", key: "id" },
    onDelete: "CASCADE", onUpdate: "CASCADE"
  },
  aprobado:         { type: DataTypes.BOOLEAN },
  fecha_aprobacion: { type: DataTypes.DATE },
  motivo_rechazo:   { type: DataTypes.STRING },
  fecha_rechazo:    { type: DataTypes.DATE },
  observaciones:    { type: DataTypes.TEXT, allowNull: true },
  estado_id: {                                          
    type: DataTypes.UUID, allowNull: true,
    references: { model: "estados", key: "id" }
  },
}, { tableName: "etapa_aprobacion", timestamps: false });