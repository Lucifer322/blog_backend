const models = require("../database/models");

async function getPost(req, res) {
  const posts = await models.post.find({});
  res.send(posts);
}

async function create(req, res) {
  if (!Object.keys(req.body).length) {
    return res.sendStatus(400);
  }
  const post = await models.post.create({
    ...req.body,
    owner: req.session.user.userId,
    approved: null
  });
  console.log(`Post ${post._id} waiting for the confirmation`);
  res.send(post);
}

async function remove(req, res) {
  const posts = await models.post.remove({});
  console.log("All posts successfully deleted");
  res.send(posts);
}

async function getById(req, res) {
  const id = req.params.id;
  const post = await models.post.findById(id);
  res.send(post);
}

async function comment(req, res) {
  if (!Object.keys(req.body).length) {
    return res.sendStatus(400);
  }
  const id = req.params.id;
  if (req.body.comment) {
    // пришёл коммент
    const { text } = req.body.comment;
    const comment = await models.comment.create({
      text,
      post: id,
      owner: req.session.user.userId
    });
    const post = await models.post.findByIdAndUpdate(id, { $push: { comments: comment } }, { new: true });
    console.log(`Post ${post._id} commented. W8 4 confirmation`);
    res.send(post);
  } else {
    res.sendStatus(400);
  }
}

async function update(req, res) {
  if (!Object.keys(req.body).length) {
    return res.sendStatus(400);
  }
  const id = req.params.id;
  const post = await models.post.findById(id);
  if (req.body.like) {
    // когда пришёл лайк, а не апдейт поста
    const userId = req.session.user.userId;
    const isLiked = post.likes.some(el => el.userId === userId);
    if (isLiked) {
      const like = await models.like.findOneAndDelete({ owner: req.session.user.userId, post: id });
      console.log(like);
      const post = await models.post.findByIdAndUpdate(id, { $pull: { likes: like._id } }, { new: true });
      console.log(`Post ${post._id} unliked`);
    } else {
      const like = await models.like.create({
        owner: req.session.user.userId,
        post: id
      });
      const post = await models.post.findByIdAndUpdate(id, { $push: { likes: like } }, { new: true });
      console.log(`Post ${post._id} liked`);
    }
    res.send(post);
  } else {
    // когда юзер или админ апдейтит пост
    if (req.session.user.isAdmin || req.session.user.userId == post.owner) {
      const post = await models.post.findByIdAndUpdate(id, { ...req.body, approved: null }, { new: true });
      console.log(`Post ${post._id} waiting for the confirmation`);
      res.send(post);
    } else res.sendStatus(403);
  }
}

async function removeById(req, res) {
  const id = req.params.id;
  const post = await models.post.findById(id);
  if (post.owner == req.session.user.userId || req.session.user.isAdmin) {
    const post = await models.post.findByIdAndDelete(id);
    console.log(`Post ${post._id} successfully deleted`);
    res.send(post);
  } else res.sendStatus(403);
}

module.exports = {
  getPost,
  getById,
  create,
  remove,
  update,
  removeById,
  comment
};
