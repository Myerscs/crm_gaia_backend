import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Rubro = sequelize.define("Rubro", {
  id:          { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  categoria:   { type: DataTypes.STRING(80),  allowNull: false, defaultValue: "Otro" },
  nombre:      { type: DataTypes.STRING(120), allowNull: false, unique: true },
  descripcion: { type: DataTypes.TEXT,        allowNull: true },
}, { tableName: "rubros", timestamps: false });