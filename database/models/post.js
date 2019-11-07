const mongoose = require("mongoose");
const { ObjectId: ID } = mongoose;

const schema = new mongoose.Schema(
  {
    title: { type: String, required: true, max: 60 },
    subtitle: { type: String, max: 80 },
    text: { type: String, required: true, max: 2000 },
    attachments: [{ type: ID, ref: "Attachment", autopopulate: true }],
    likes: [{ type: ID, ref: "Like", autopopulate: true }],
    comments: [{ type: ID, ref: "Comment", autopopulate: true }],
    approved: { type: Boolean, default: null },
    owner: { type: ID, ref: "User", autopopulate: true },
    createdAt: { type: Date, default: new Date().toLocaleString() },
    updatedTime: { type: Date, default: null }
  },
  { versionKey: false }
);

schema.plugin(require("mongoose-autopopulate"));

module.exports = mongoose.model("Post", schema);
