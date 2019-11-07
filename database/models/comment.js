const mongoose = require("mongoose");
const { ObjectId: ID } = mongoose;

const schema = new mongoose.Schema(
  {
    text: { type: String, required: true, max: 800 },
    post: { type: ID, ref: "Post", required: true },
    owner: { type: ID, ref: "User", autopopulate: true },
    createdAt: { type: Date, default: new Date().toLocaleString() },
    approved: { type: Boolean, default: null }
  },
  { versionKey: false }
);

schema.plugin(require("mongoose-autopopulate"));

module.exports = mongoose.model("Comment", schema);
