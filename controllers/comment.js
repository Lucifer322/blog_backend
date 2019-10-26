const models = require("../database/models");

async function create(req, res) {
  if (!Object.keys(req.body).length) {
    return res.sendStatus(400);
  }
  if (req.body.comment) {
    const { text, postId } = req.body.comment;
    const comment = await models.comment.create({
      text,
      post: postId,
      owner: req.session.user._id
    });
    const post = await models.post.findByIdAndUpdate(postId, { $push: { comments: comment } }, { new: true });
    console.log(`Post ${post._id} commented. W8 4 confirmation`);
    res.send(post);
  } else {
    res.sendStatus(400);
  }
}

module.exports = {
  create
};
