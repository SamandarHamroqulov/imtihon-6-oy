import { DataTypes } from "sequelize";
import { sequelize } from "../../services/db.service";

export  const CommentModel =  sequelize.define("Comment", {
        id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    bookId:{ 
        type: DataTypes.INTEGER,
        allowNull: false
    },
    userId: {
        type :DataTypes.INTEGER,
        allowNull: false
    },
    commentText: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    rating: {
        type: DataTypes.INTEGER,
        validate: {
            min: 1,
            max: 5
        }
    },

    
}, {
    timestamps: true,
    tableName: "comments"
})