const jwt = require('jsonwebtoken');
const secretKey = 'luci13';
const { User } = require("./models");

const adminCheck = async (req, res, next) => {
  if (req.get('Authorization')) {
    const [, token] = req.get('Authorization').split(' ');
    const id = jwt.verify(token, secretKey).userId;
    const user = await User.findById(id);
    if (user.isAdmin) next();
  }
  res.send('You have to be an admin!')
  next('route');
}

module.exports = {
  adminCheck
};