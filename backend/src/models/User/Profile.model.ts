import { DataTypes } from "sequelize";
import { sequelize } from "../../services/db.service";

export const ProfileModel = sequelize.define("Profile", {
     id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
},{
    timestamps: true,
    tableName: "profiles"
})