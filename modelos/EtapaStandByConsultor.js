import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const EtapaStandByConsultor = sequelize.define("EtapaStandByConsultor", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  etapa_stand_by_id: {
    type: DataTypes.UUID, allowNull: false,
    references: { model: "etapa_stand_by", key: "id" },
    onDelete: "CASCADE", onUpdate: "CASCADE"
  },
  consultor_id: {
    type: DataTypes.UUID, allowNull: false,
    references: { model: "consultores", key: "id" },
    onDelete: "CASCADE", onUpdate: "CASCADE"
  },
}, {
  tableName: "etapa_stand_by_consultor",
  timestamps: false,
  indexes: [{ unique: true, name: "uniq_standby_cons", fields: ["etapa_stand_by_id", "consultor_id"] }]
});