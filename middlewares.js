const jwt = require("jsonwebtoken");
const secretKey = "luci13";

const getUserFromHeader = (req, res, next) => {
  const {
    headers: { authorization }
  } = req;
  if (authorization && authorization.split(" ")[0] === "Bearer") {
    const token = authorization.split(" ")[1];
    if (jwt.verify(token, secretKey).userId) {
      req.session.user = jwt.verify(token, secretKey);
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
