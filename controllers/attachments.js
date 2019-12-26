const models = require("../database/models");

async function create(req, res) {
  const attachment = await models.attachment.create({
    owner: req.session.user._id,
    src: req.file.src,
    type: req.file.mimetype,
    name: req.file.originalname
  });
  res.send(attachment);
}

module.exports = {
  create
};
