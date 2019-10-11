const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    login: String,
    password: String,
    posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    isAdmin: Boolean
  },
  { versionKey: false }
);

const postSchema = new Schema(
  {
    img: String,
    text: String,
    likes: [{ type: Schema.Types.ObjectId, ref: "Like" }],
    comments: [{ type: Schema.Types.ObjectId, ref: "User" }],
    userId: String,
    approved: Boolean,
    owner: { type: Schema.Types.ObjectId, ref: "User" }
  },
  { versionKey: false }
);

const likeSchema = new Schema(
  {
    post: { type: Schema.Types.ObjectId, ref: "Post" },
    owner: { type: Schema.Types.ObjectId, ref: "User" }
  },
  { versionKey: false }
);

const commentSchema = new Schema(
  {
    text: String,
    post: { type: Schema.Types.ObjectId, ref: "Post" },
    owner: { type: Schema.Types.ObjectId, ref: "User" }
  },
  { versionKey: false }
);

const Comment = mongoose.model("Comment", commentSchema);
const Like = mongoose.model("Like", likeSchema);
const User = mongoose.model("User", userSchema);
const Post = mongoose.model("Post", postSchema);

// module.exports = {
//   Comment,
//   Like,
//   User,
//   Post
// };
