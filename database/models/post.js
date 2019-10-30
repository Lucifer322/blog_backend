const mongoose = require("mongoose");
const { ObjectId: ID } = mongoose;

const schema = new mongoose.Schema(
  {
    title: String,
    text: String,
    attachments: [{ type: ID, ref: "Attachment" }],
    likes: [{ type: ID, ref: "Like", autopopulate: true }],
    comments: [{ type: ID, ref: "Comment" }],
    approved: Boolean,
    owner: { type: ID, ref: "User" },
    createdAt: { type: Date, default: Date.now() },
    updatedTime: { type: Date, default: Date.now() }
  },
  { versionKey: false }
);

schema.plugin(require("mongoose-autopopulate"));

module.exports = mongoose.model("Post", schema);
