const models = require("../database/models");

async function getAll(req, res) {
  const users = await models.user.find({});
  res.send(users);
}

async function remove(req, res) {
  const users = await models.user.remove({});
  console.log("Users successfully deleted");
  res.send(users);
}

async function getById(req, res) {
  const id = req.params.id;
  const user = await models.user.findById(id);
  res.send(user);
}

async function removeById(req, res) {
  const id = req.params.id;
  const user = await models.user.findByIdAndDelete(id);
  console.log(`User ${user._id} successfully deleted`);
  res.send(user);
}

module.exports = {
  getAll,
  remove,
  getById,
  removeById
};
