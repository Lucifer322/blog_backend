const { models } = require('../database');
const logger = require('../logger');

async function errorHandler(err, req, res, next) {
  switch (err.name) {
    case 'JsonWebTokenError':
      res.status(401).send('Invalid token');
      break;
    case 'ValidationError':
      res.status(400).send('Validation error');
      break;
    case 'CastError':
      res.status(400).send('Validation error');
      break;
    default:
      logger.error(err);
      res.sendStatus(err.status || 500);
      break;
  }
}

async function getUserFromHeader(req, res, next) {
  const {
    headers: { authorization },
  } = req;
  if (authorization && authorization.split(' ')[0] === 'Bearer') {
    const token = authorization.split(' ')[1];
    if (await models.user.jwtVerify(token)) {
      req.session.user = await models.user.jwtVerify(token);
    }
  } else req.session.user = null;
  next();
}

const loggedInCheck = (req, res, next) => {
  if (!req.session.user) {
    res.sendStatus(401);
    next('route');
  } else {
    next();
  }
};

const adminCheck = (req, res, next) => {
  if (!req.session.user.isAdmin) {
    res.sendStatus(403);
    next('route');
  } else {
    next();
  }
};

module.exports = {
  getUserFromHeader,
  loggedInCheck,
  adminCheck,
  errorHandler,
};
