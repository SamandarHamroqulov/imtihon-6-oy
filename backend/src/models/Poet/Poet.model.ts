import { DataTypes, DATE } from "sequelize";
import { sequelize } from "../../services/db.service";

export const PoetModel = sequelize.define("Poet", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  firstname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false
  },
  birthDate: {
    type: DATE,
    allowNull: false
  },
  deathDate :{
    type: DataTypes.DATE,
    allowNull: true
    
  },
  genre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  }


},{ 
    timestamps: true,
    tableName: "poets"
});
