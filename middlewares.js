const jwt = require("jsonwebtoken");
const secretKey = "luci13";
const session = require("express-session");

const getUserFromHeader = (req, res, next) => {
  const {
    headers: { authorization }
  } = req;
  if (authorization && authorization.split(" ")[0] === "Bearer") {
    const token = authorization.split(" ")[1];
    if (jwt.verify(token, secretKey).userId) req.session.user = jwt.verify(token, secretKey);
  } else req.session.user = null;
  next();
};

module.exports = {
  getUserFromHeader
};
