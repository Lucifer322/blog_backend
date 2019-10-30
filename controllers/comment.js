const models = require("../database/models");

async function create(req, res) {
  if (!req.body.text || !req.body.postId) {
    console.log("here");
    return res.sendStatus(400);
  }
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

module.exports = {
  create
};
