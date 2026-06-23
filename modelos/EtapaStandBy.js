import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const EtapaStandBy = sequelize.define("EtapaStandBy", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  proceso_id: {
    type: DataTypes.UUID, allowNull: false,
    references: { model: "procesos", key: "id" },
    onDelete: "CASCADE", onUpdate: "CASCADE"
  },
  fecha_inicio_pausa:     { type: DataTypes.DATE,   allowNull: true },
  fecha_estimada_retorno: { type: DataTypes.DATE,   allowNull: true },
  motivo_categoria: {
    type: DataTypes.ENUM(
      "Presupuesto congelado", "Decisión pendiente", "Cambio interno cliente",
      "Espera técnica", "Prioridad baja", "Retraso externo", "Otro"
    ),
    allowNull: true
  },
  motivo_detalle:       { type: DataTypes.TEXT,   allowNull: true },
  decision_por:         { type: DataTypes.STRING, allowNull: true }, 
  condicion_reactivar:  { type: DataTypes.TEXT,   allowNull: true }, 
  observaciones:        { type: DataTypes.TEXT,   allowNull: true },
  proximos_pasos:       { type: DataTypes.TEXT,   allowNull: true },
  estado_id: {
    type: DataTypes.UUID, allowNull: true,
    references: { model: "estados", key: "id" }
  },
}, { tableName: "etapa_stand_by", timestamps: false });