const models = require("../database/models");

async function create(req, res, next) {
  const promises = req.files.map(async file => {
    console.log(req.session.user);
    return await models.attachment.create({
      owner: req.session.user._id,
      src: file.src,
      type: file.mimetype,
      name: file.originalname
    });
  });
  const attachments = await Promise.all(promises);
  res.send(attachments);
}

module.exports = {
  create
};
