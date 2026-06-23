import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Soporte = sequelize.define("Soporte", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  cliente_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: "clientes", key: "id" },
    onDelete: "NO ACTION",
    onUpdate: "CASCADE",
  },
  responsable_cliente_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: { model: "usuario_cliente", key: "id" },
    onDelete: "NO ACTION",
    onUpdate: "CASCADE",
  },
  created_by: {
    type: DataTypes.UUID,
    allowNull: true,
    references: { model: "consultores", key: "id" },
    onDelete: "NO ACTION",
    onUpdate: "CASCADE",
  },
  updated_by: {
    type: DataTypes.UUID,
    allowNull: true,
    references: { model: "consultores", key: "id" },
    onDelete: "NO ACTION",
    onUpdate: "CASCADE",
  },
  estado: { type: DataTypes.ENUM("En Aprobación", "Aprobado", "Rechazado"), allowNull: false, defaultValue: "En Aprobación" },
  propuesta: { type: DataTypes.TEXT, allowNull: true },
  horas: { type: DataTypes.INTEGER, allowNull: true },
  tarifa: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
  valor_paquete: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
  fecha_inicio: { type: DataTypes.DATEONLY, allowNull: true },
  fecha_fin: { type: DataTypes.DATEONLY, allowNull: true },
  horario: { type: DataTypes.STRING(100), allowNull: true },
  dias: { type: DataTypes.JSON, allowNull: true }, observacion: { type: DataTypes.TEXT, allowNull: true },
  fecha_aprobacion: { type: DataTypes.DATEONLY, allowNull: true },
  fecha_rechazo: { type: DataTypes.DATEONLY, allowNull: true },
  motivo_rechazo: { type: DataTypes.TEXT, allowNull: true },
  fecha_inicio_soporte: { type: DataTypes.DATEONLY, allowNull: true },
}, { tableName: "soportes", timestamps: true });