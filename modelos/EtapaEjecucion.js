import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const EtapaEjecucion = sequelize.define("EtapaEjecucion", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  proceso_id: {
    type: DataTypes.UUID, allowNull: false,
    references: { model: "procesos", key: "id" },
    onDelete: "CASCADE", onUpdate: "CASCADE"
  },
  fecha_inicio:   { type: DataTypes.DATE,    allowNull: true },
  fecha_fin:      { type: DataTypes.DATE,    allowNull: true  },
  observaciones:  { type: DataTypes.TEXT,    allowNull: true  },
  proximos_pasos: { type: DataTypes.TEXT,    allowNull: true  }, 
  estado_id: {                                                    
    type: DataTypes.UUID, allowNull: true,
    references: { model: "estados", key: "id" }
  },
}, { tableName: "etapa_ejecucion", timestamps: false });