import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const EtapaFacturadoItem = sequelize.define("EtapaFacturadoItem", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  etapa_facturado_id: {
    type: DataTypes.UUID, allowNull: false,
    references: { model: "etapa_facturado", key: "id" },
    onDelete: "CASCADE", onUpdate: "CASCADE"
  },
  nombre:            { type: DataTypes.STRING,  allowNull: true },
  numero_factura:    { type: DataTypes.STRING,  allowNull: true },
  fecha_factura:     { type: DataTypes.DATEONLY, allowNull: true },
  dias_credito:      { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
  fecha_vencimiento: { type: DataTypes.DATEONLY, allowNull: true }, 
  valor_facturado:   { type: DataTypes.DECIMAL(12,2), allowNull: true },
  estado_cobro: {
    type: DataTypes.ENUM("Pendiente", "Pagado", "Vencido", "Anulado"),
    allowNull: true, defaultValue: "Pendiente"
  },
}, { tableName: "etapa_facturado_item", timestamps: false });