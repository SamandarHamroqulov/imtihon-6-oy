"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Book_model_1 = require("./Book/Book.model");
const Bookshelf_Model_1 = require("./Bookshelf/Bookshelf.Model");
const BookshelItem_model_1 = require("./Bookshelf/BookshelItem.model");
const Comment_model_1 = require("./Comment/Comment.model");
const Poet_model_1 = require("./Poet/Poet.model");
const Profile_model_1 = require("./User/Profile.model");
const User_model_1 = require("./User/User.model");
Poet_model_1.PoetModel.hasMany(Book_model_1.BookModel, {
    foreignKey: "poetId",
    onDelete: "CASCADE"
});
Book_model_1.BookModel.belongsTo(Poet_model_1.PoetModel, {
    foreignKey: "poetId"
});
Bookshelf_Model_1.BookshelfModel.belongsToMany(Book_model_1.BookModel, {
    through: BookshelItem_model_1.BookshelfItemModel,
    foreignKey: "bookshelfId"
});
Book_model_1.BookModel.belongsToMany(Bookshelf_Model_1.BookshelfModel, {
    through: BookshelItem_model_1.BookshelfItemModel,
    foreignKey: "bookId"
});
User_model_1.UserModel.hasOne(Profile_model_1.ProfileModel, { foreignKey: "userId", onDelete: "CASCADE" });
Profile_model_1.ProfileModel.belongsTo(User_model_1.UserModel, { foreignKey: "userId" });
Book_model_1.BookModel.hasMany(Comment_model_1.CommentModel, {
    foreignKey: "bookId",
    onDelete: "CASCADE"
});
Comment_model_1.CommentModel.belongsTo(Book_model_1.BookModel, {
    foreignKey: "bookId"
});
User_model_1.UserModel.hasMany(Comment_model_1.CommentModel, {
    foreignKey: "userId",
    onDelete: "CASCADE"
});
Comment_model_1.CommentModel.belongsTo(User_model_1.UserModel, {
    foreignKey: "userId"
});
