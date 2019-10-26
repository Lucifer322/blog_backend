const models = require("../database/models");

async function toggle(req, res) {
  if (!Object.keys(req.body).length) {
    return res.sendStatus(400);
  }
  if (req.body.like) {
    const id = req.body.like.postId;
    const post = await models.post.findById(id);
    const userId = req.session.user._id.toString();
    const isLiked = post.likes.some(el => el.owner == userId);
    if (isLiked) {
      const like = await models.like.findOneAndDelete({ owner: req.session.user._id, post: id });
      const post = await models.post.findByIdAndUpdate(id, { $pull: { likes: like._id } }, { new: true });
      console.log(`Post ${post._id} unliked`);
    } else {
      const like = await models.like.create({
        owner: req.session.user._id,
        post: id
      });
      const post = await models.post.findByIdAndUpdate(id, { $push: { likes: like } }, { new: true });
      console.log(`Post ${post._id} liked`);
    }
    res.send(post);
  }
}

module.exports = {
  toggle
};
