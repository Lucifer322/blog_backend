const mongoose = require("mongoose");
const { ObjectId: ID } = mongoose;

const schema = new mongoose.Schema(
  {
    text: String,
    post: { type: ID, ref: "Post" },
    owner: { type: ID, ref: "User" },
    createdAt: { type: Date, default: Date.now }
  },
  { versionKey: false }
);

module.exports = mongoose.model("Comment", schema);
