const models = require("../database/models");

async function getAll(req, res, next) {
  const posts = await models.post.find();
  res.send(posts);
}

async function create(req, res) {
  if (!Object.keys(req.body).length) {
    return res.sendStatus(400);
  }
  let { attachments, body, title } = req.body;
  const post = await models.post.create({
    title,
    body,
    attachments,
    comments: [],
    likes: [],
    owner: req.session.user._id,
    approved: null
  });
  console.log(`Post ${post._id} waiting for the confirmation`);
  res.send(post);
}

async function remove(req, res) {
  const posts = await models.post.remove();
  console.log("All posts successfully deleted");
  res.send(posts);
}

async function getById(req, res) {
  const post = await models.post.findById(req.params.id);
  res.send(post);
}

async function update(req, res) {
  if (!Object.keys(req.body).length) {
    return res.sendStatus(400);
  }
  const post = await models.post.findById(req.params.id);
  if (req.session.user.isAdmin || req.session.user._id == post.owner) {
    const post = await models.post.findByIdAndUpdate(
      req.params.id,
      { ...req.body, approved: null },
      { new: true }
    );
    console.log(`Post ${post._id} waiting for the confirmation`);
    res.send(post);
  } else res.sendStatus(403);
}

async function removeById(req, res) {
  const post = await models.post.findById(req.params.id);
  if (post.owner == req.session.user._id || req.session.user.isAdmin) {
    const post = await models.post.findByIdAndDelete(req.params.id);
    console.log(`Post ${post._id} successfully deleted`);
    res.send(post);
  } else res.sendStatus(403);
}

module.exports = {
  getAll,
  getById,
  create,
  remove,
  update,
  removeById
};
