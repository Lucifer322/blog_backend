const mongoose = require("mongoose");
const { ObjectId: ID } = mongoose;

const schema = new mongoose.Schema(
  {
    text: { type: String, required: true, minlength: 3, maxlength: 800 },
    post: { type: ID, ref: "Post", required: true },
    owner: { type: ID, ref: "User", autopopulate: true },
    approved: { type: Boolean, default: null }
  },
  { versionKey: false, timestamps: { createdAt: "created_at" } }
);

schema.plugin(require("mongoose-autopopulate"));

module.exports = mongoose.model("Comment", schema);
