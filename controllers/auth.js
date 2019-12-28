const models = require('../database/models');

async function register(req, res) {
  if (!req.body.login || !req.body.password) return res.sendStatus(400);
  const { login, password } = req.body;
  if (await models.user.findOne({ login })) {
    res.send('Login already exist');
  } else {
    const user = await models.user.create({
      login,
      password,
      isAdmin: false,
    });
    console.log(`User ${user} successfully created`);
    let token = await user.jwtSign();
    res.send({ token, userId: user._id });
  }
}

async function login(req, res) {
  const { login, password } = req.body;
  const user = await models.user.findOne({ login });
  if (user && user.verifyPassword(password)) {
    const token = await user.jwtSign();
    res.send({ token, userId: user._id });
    console.log('User successfully logged in');
  } else res.send('Credentials is invalid');
}

module.exports = {
  login,
  register,
};
