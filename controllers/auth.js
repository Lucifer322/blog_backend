const models = require("../database/models");
const jwt = require("jsonwebtoken");
const pwd = require("password-hash");

async function register(req, res) {
  if (!req.body.login || !req.body.password) return res.sendStatus(400);
  const { login, password } = req.body;
  if (await models.user.findOne({ login })) {
    res.send("Login already exist");
  } else {
    const hashedPassword = pwd.generate(password);
    const user = await models.user.create({
      login,
      password: hashedPassword,
      isAdmin: false
    });
    console.log(`User ${user} successfully created`);
    let token = jwt.sign(user.toJSON(), process.env.SECRET_KEY);
    res.send(token);
  }
}

async function login(req, res) {
  const { login, password } = req.body;
  const user = await models.user.findOne({ login });
  if (user && pwd.verify(password, user.password)) {
    let token = jwt.sign(user.toJSON(), process.env.SECRET_KEY);
    res.send(token);
    console.log("User successfully logged in");
  } else res.send("Credentials is invalid");
}

module.exports = {
  login,
  register
};
