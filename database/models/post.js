const mongoose = require("mongoose");
const { ObjectId: ID } = mongoose;

const schema = new mongoose.Schema(
  {
    title: { type: String, required: true, max: 80 },
    text: { type: String, required: true, max: 2000 },
    attachments: [{ type: ID, ref: "Attachment" }],
    likes: [{ type: ID, ref: "Like", autopopulate: true }],
    comments: [{ type: ID, ref: "Comment" }],
    approved: { type: Boolean, default: null },
    owner: { type: ID, ref: "User" },
    createdAt: { type: Date, default: Date.now() },
    updatedTime: { type: Date, default: null }
  },
  { versionKey: false }
);

schema.plugin(require("mongoose-autopopulate"));

module.exports = mongoose.model("Post", schema);
