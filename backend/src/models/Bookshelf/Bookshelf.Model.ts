import { DataTypes } from "sequelize";
import { sequelize } from "../../services/db.service";

export const BookshelfModel = sequelize.define("Bookshelf", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "My Bookshelf",
  },
},{
    timestamps: true,
    tableName: "bookshelves"
});
