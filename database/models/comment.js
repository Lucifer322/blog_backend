const mongoose = require("mongoose");
const { ObjectId: ID } = mongoose;

const schema = new mongoose.Schema(
  {
    text: { type: String, required: true, max: 800 },
    post: { type: ID, ref: "Post", required: true },
    owner: { type: ID, ref: "User" },
    createdAt: { type: Date, default: Date.now }
  },
  { versionKey: false }
);

module.exports = mongoose.model("Comment", schema);
