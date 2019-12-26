const models = require('../database/models');

async function getAll(req, res, next) {
  const posts = await models.post.find();
  res.send(posts);
}

async function create(req, res) {
  const post = await models.post.create({
    ...req.body,
    owner: req.session.user._id,
  });
  console.log(`Post ${post._id} waiting for the confirmation`);
  res.send(post);
}

async function remove(req, res) {
  const posts = await models.post.remove();
  console.log('All posts successfully deleted');
  res.send(posts);
}

async function getById(req, res) {
  const post = await models.post.findById(req.params.id);
  res.send(post);
}

async function update(req, res) {
  console.log(req.body.text.length);
  console.log(req.body.text.replace(/<.+?>/g, '').length);
  if (!Object.keys(req.body).length) return res.sendStatus(400);
  const post = await models.post.findById(req.params.id);
  let approved = req.session.user.isAdmin || null;
  if (req.session.user.isAdmin || req.session.user._id.toString() == post.owner._id) {
    const post = await models.post.findByIdAndUpdate(req.params.id, { ...req.body, approved }, { new: true });
    console.log(`Post ${post._id} waiting for the confirmation`);
    res.send(post);
  } else res.sendStatus(403);
}

async function removeById(req, res) {
  const post = await models.post.findById(req.params.id);
  if (post.owner._id == req.session.user._id.toString() || req.session.user.isAdmin) {
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
  removeById,
};
