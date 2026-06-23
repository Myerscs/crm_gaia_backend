import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const SeguimientoContacto = sequelize.define("SeguimientoContacto", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  seguimiento_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  usuario_cliente_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
}, {
  tableName: "seguimientos_contactos",
  timestamps: false,
});