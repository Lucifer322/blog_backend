const models = require("../database/models");

async function create(req, res) {
  const { text, postId } = req.body;
  const comment = await models.comment.create({
    text,
    post: postId,
    owner: req.session.user._id
  });
  const post = await models.post.findByIdAndUpdate(postId, { $push: { comments: comment } }, { new: true });
  console.log(`Post ${post._id} commented. W8 4 confirmation`);
  res.send(post);
}

async function remove(req, res) {
  const comment = await models.comment.findById(req.params.id);
  if (comment.owner == req.session.user._id || req.session.user.isAdmin) {
    const comment = await models.comment.findByIdAndDelete(req.params.id);
    console.log(`Comment ${comment._id} successfully deleted`);
    res.send(comment);
  } else res.sendStatus(403);
}

module.exports = {
  create,
  remove
};
