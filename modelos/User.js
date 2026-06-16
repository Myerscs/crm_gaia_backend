import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const User = sequelize.define("User", {

  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },

  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false
  },

  rol: {
    type: DataTypes.TEXT,
    allowNull: false
  },

  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },

  verificado: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },

  token_verificacion: {
    type: DataTypes.STRING,
    allowNull: true
  },

  google_token: {
    type: DataTypes.TEXT("long"),
    allowNull: true,
    defaultValue: null
  },
  tokens : {
    type: DataTypes.INTEGER,
    defaultValue: 100
  } ,
  renovacion_tokens: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  ia_activa: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: "users",
  timestamps: true
});

export default User;