import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const EtapaPreliminar = sequelize.define("EtapaPreliminar",{

  id:{
    type:DataTypes.UUID,
    defaultValue:DataTypes.UUIDV4,
    primaryKey:true
  },
  
  proceso_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "procesos",
      key: "id"
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
  },
  fecha_preliminar: {
    type:DataTypes.DATE
  },
  resultado:{
    type:DataTypes.STRING
  },
  observaciones:{
    type:DataTypes.TEXT,
    allowNull:true
  },
 probabilidad: {
    type: DataTypes.ENUM('Alta', 'Media', 'Baja'),
    allowNull: true,
  },
},{
  tableName:"etapa_preliminar",
  timestamps:false
});