const mongoose = require('mongoose');
const { ObjectId: ID } = mongoose;

const schema = new mongoose.Schema(
  {
    title: { type: String, required: true, minlength: 3, maxlength: 60 },
    subtitle: { type: String, maxlength: 80 },
    text: { type: String, required: true, maxlength: 2000 },
    attachments: [{ type: ID, ref: 'Attachment', autopopulate: true }],
    likes: [{ type: ID, ref: 'Like', autopopulate: true }],
    comments: [{ type: ID, ref: 'Comment', autopopulate: true }],
    approved: { type: Boolean, default: null },
    owner: { type: ID, ref: 'User', autopopulate: true },
  },
  { versionKey: false, timestamps: { createdAt: 'created_at' } },
);

schema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('Post', schema);
