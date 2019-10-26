const posts = require("./posts");
const users = require("./users");
const auth = require("./auth");
const uploads = require("./uploads");
const attachments = require("./attachments");
const comment = require("./comment");
const like = require("./like");

module.exports = {
  posts,
  auth,
  uploads,
  attachments,
  users,
  like,
  comment
};
