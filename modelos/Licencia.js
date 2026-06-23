import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Licencia = sequelize.define("Licencia", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  cliente_id: { type: DataTypes.UUID, allowNull: false, references: { model: "clientes", key: "id" } },
  estado: { type: DataTypes.ENUM("Activada", "Desactivada"), allowNull: false, defaultValue: "Activada" },
  fecha_inicio: { type: DataTypes.DATEONLY, allowNull: true },
  renovacion: { type: DataTypes.ENUM("mensual", "anual", "2 años", "3 años"), allowNull: true },
  herramienta_id: {                              
    type: DataTypes.UUID,
    allowNull: true,
    references: { model: "herramientas_rpa", key: "id" }
  },
  valor_anual: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
  ip_maquina: { type: DataTypes.STRING(45), allowNull: true },
  fecha_estado: { type: DataTypes.DATEONLY, allowNull: true },
  motivo_desactivacion: { type: DataTypes.TEXT, allowNull: true },
  created_by: { type: DataTypes.UUID, references: { model: "consultores", key: "id" } },
  updated_by: { type: DataTypes.UUID, references: { model: "consultores", key: "id" } },
}, { tableName: "licencias", timestamps: true });