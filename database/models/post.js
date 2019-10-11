const mongoose = require("mongoose");
const { ObjectId: ID } = mongoose;

const schema = new mongoose.Schema(
  {
    img: String,
    text: String,
    likes: [{ type: ID, ref: "Like" }],
    comments: [{ type: ID, ref: "User" }],
    userId: String,
    approved: Boolean,
    owner: { type: ID, ref: "User" }
  },
  { versionKey: false }
);

module.exports = mongoose.model("Post", schema);
