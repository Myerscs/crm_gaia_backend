import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const InteraccionStandByConsultor = sequelize.define("InteraccionStandByConsultor", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  interaccion_stand_by_id: {
    type: DataTypes.UUID, allowNull: false,
    references: { model: "interaccion_stand_by", key: "id" },
    onDelete: "CASCADE"
  },
  consultor_id: {
    type: DataTypes.UUID, allowNull: false,
    references: { model: "consultores", key: "id" },
    onDelete: "CASCADE"
  },
}, {
  tableName: "interaccion_stand_by_consultor",
  timestamps: false,
  indexes: [{ unique: true, name: "uniq_istandby_cons", fields: ["interaccion_stand_by_id", "consultor_id"] }]
});