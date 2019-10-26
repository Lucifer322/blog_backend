const jwt = require("jsonwebtoken");
const { models } = require("../database");

async function errorHandler(err, req, res, next) {
  switch (err.name) {
    case "JsonWebTokenError":
      res.status(401).send("Invalid token");
      break;
    case "UnauthorizedError":
      res.status(401).send("Unauthorized");
      break;
    default:
      if (!err.status || err.status >= 500) {
        console.error(err);
      }
      break;
  }
}

async function getUserFromHeader(req, res, next) {
  const {
    headers: { authorization }
  } = req;
  if (authorization && authorization.split(" ")[0] === "Bearer") {
    const token = authorization.split(" ")[1];
    if (jwt.verify(token, process.env.SECRET_KEY)._id) {
      req.session.user = await models.user.findById(jwt.verify(token, process.env.SECRET_KEY)._id);
    }
  } else req.session.user = null;
  next();
}

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
  adminCheck,
  errorHandler
};
