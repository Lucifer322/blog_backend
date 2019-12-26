const posts = require("./posts");
const users = require("./users");
const auth = require("./auth");
const uploads = require("./uploads");
const attachments = require("./attachments");
const comments = require("./comments");
const like = require("./like");

module.exports = {
  posts,
  auth,
  uploads,
  attachments,
  users,
  like,
  comments
};
