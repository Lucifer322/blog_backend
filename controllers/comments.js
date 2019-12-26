const models = require("../database/models");

async function create(req, res) {
  let approved = null;
  if (req.session.user.isAdmin) approved = true;
  const { text, postId } = req.body;
  let comment = await models.comment.create({
    text,
    post: postId,
    owner: req.session.user._id,
    approved
  });
  comment = await comment.populate("owner").execPopulate();
  const post = await models.post.findByIdAndUpdate(postId, { $push: { comments: comment } }, { new: true });
  console.log(`Post ${post._id} commented. W8 4 confirmation`);
  res.send(comment);
}

async function remove(req, res) {
  const comment = await models.comment.findById(req.params.id);
  if (comment.owner == req.session.user._id || req.session.user.isAdmin) {
    const comment = await models.comment.findByIdAndDelete(req.params.id);
    console.log(`Comment ${comment._id} successfully deleted`);
    res.send(comment);
  } else res.sendStatus(403);
}

async function approve(req, res) {
  if (req.session.user.isAdmin) {
    const comment = await models.comment.findByIdAndUpdate(req.params.id, { approved: true }, { new: true });
    console.log(`Comment ${comment._id} approved`);
    res.send(comment);
  } else res.sendStatus(403);
}

async function getAll(req, res) {
  const comments = await models.comment.find();
  res.send(comments);
}

module.exports = {
  create,
  remove,
  getAll,
  approve
};
