const mongoose = require("mongoose");
const { ObjectId: ID } = mongoose;

const schema = new mongoose.Schema(
  {
    login: String,
    password: String,
    posts: [{ type: ID, ref: "Post" }],
    isAdmin: Boolean
  },
  { versionKey: false }
);

module.exports = mongoose.model("User", schema);
