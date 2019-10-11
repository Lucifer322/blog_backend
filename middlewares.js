const jwt = require("jsonwebtoken");
const { models } = require("./database");

const getUserFromHeader = async (req, res, next) => {
  const {
    headers: { authorization }
  } = req;
  if (authorization && authorization.split(" ")[0] === "Bearer") {
    const token = authorization.split(" ")[1];
    if (jwt.verify(token, process.env.SECRET_KEY).userId) {
      req.session.user = await models.user.findById(jwt.verify(token, process.env.SECRET_KEY).userId);
    }
  } else req.session.user = null;
  next();
};

const loggedInCheck = (req, res, next) => {
  if (!req.session.user) {
    res.sendStatus(401);
    next("route");
  } else {
    next();
  }
};

const adminCheck = (req, res, next) => {
  if (!req.session.user.isAdmin) {
    res.sendStatus(403);
    next("route");
  } else {
    next();
  }
};

module.exports = {
  getUserFromHeader,
  loggedInCheck,
  adminCheck
};
