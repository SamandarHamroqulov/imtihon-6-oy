import { DataTypes, DATE } from "sequelize";
import { sequelize } from "../../services/db.service";

const UserModel = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
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
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
        isEmail: true
    }
  },
  password:{ 
    type : DataTypes.STRING,
    allowNull: false
  }
  ,
  otp: {
    type: DataTypes.INTEGER,
  },
  otpExpires:{ 
    type: DataTypes.DATE
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  role: {
    type: DataTypes.ENUM("admin","user"),
    defaultValue: "user"
  }


},
{
    timestamps: true,
    tableName: "users"
});

export {UserModel}