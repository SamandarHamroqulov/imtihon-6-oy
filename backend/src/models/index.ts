import { BookModel } from "./Book/Book.model";
import { BookshelfModel } from "./Bookshelf/Bookshelf.Model";
import { BookshelfItemModel } from "./Bookshelf/BookshelItem.model";
import { CommentModel } from "./Comment/Comment.model";
import { PoetModel } from "./Poet/Poet.model";
import { ProfileModel } from "./User/Profile.model";
import { UserModel } from "./User/User.model";

PoetModel.hasMany(BookModel, {
    foreignKey: "poetId",
    onDelete: "CASCADE"
})
BookModel.belongsTo(PoetModel, {
    foreignKey: "poetId"
})

BookshelfModel.belongsToMany(BookModel, {
    through: BookshelfItemModel,
    foreignKey: "bookshelfId"
})

BookModel.belongsToMany(BookshelfModel, {
    through: BookshelfItemModel,
    foreignKey: "bookId"
})

UserModel.hasOne(ProfileModel, { foreignKey: "userId", onDelete: "CASCADE" });
ProfileModel.belongsTo(UserModel, { foreignKey: "userId" });

BookModel.hasMany(CommentModel, {
    foreignKey: "bookId",
    onDelete: "CASCADE"
    
})
CommentModel.belongsTo(BookModel, {
    foreignKey: "bookId"
})

UserModel.hasMany(CommentModel, {
    foreignKey: "userId",
    onDelete: "CASCADE"

})
CommentModel.belongsTo(UserModel, {
    foreignKey: "userId"
})