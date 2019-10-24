const mongoose = require("mongoose");
const { ObjectId: ID } = mongoose;

const schema = new mongoose.Schema(
  {
    owner: { type: ID, ref: "User" },
    src: String,
    type: String,
    name: String
  },
  { versionKey: false }
);

module.exports = mongoose.model("Attachment", schema);
