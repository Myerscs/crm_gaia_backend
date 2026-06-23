import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Consultor = sequelize.define(
  "Consultor",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    nombre:   { type: DataTypes.STRING,  allowNull: false },
    email:    { type: DataTypes.STRING,  allowNull: false },
    rol:      { type: DataTypes.STRING,  allowNull: false },  
    telefono: { type: DataTypes.STRING,  allowNull: true },
    activo:   { type: DataTypes.BOOLEAN, defaultValue: true },
    fecha_ingreso: { type: DataTypes.DATEONLY, allowNull: true },

    vistas: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],   
    },
  },
  { tableName: "consultores", timestamps: true }
);