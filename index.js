const middlewares = require("./middlewares");
const { db } = require("./database");
const express = require("express");
const session = require("express-session");
const app = express();
const controllers = require("./controllers");
require("dotenv").config();

app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  })
);
app.use(middlewares.getUserFromHeader);

db.once("open", () => {
  app.listen(3333, () => {
    console.log("Server ON");
  });
});

app
  .route("/posts")
  .get(controllers.posts.getPost)
  .post([middlewares.loggedInCheck, controllers.posts.create])
  .delete([middlewares.loggedInCheck, middlewares.adminCheck, controllers.posts.remove]);

app
  .route("/users")
  .get([middlewares.loggedInCheck, middlewares.adminCheck, controllers.users.getAll])
  .delete([middlewares.loggedInCheck, middlewares.adminCheck, controllers.users.remove]);

app
  .route("/users/:id")
  .get(controllers.users.getById)
  .delete([middlewares.loggedInCheck, middlewares.adminCheck, controllers.users.removeById]);

app
  .route("/posts/:id")
  .get(controllers.posts.getById)
  .post([middlewares.loggedInCheck, controllers.posts.comment])
  .put([middlewares.loggedInCheck, controllers.posts.update])
  .delete([middlewares.loggedInCheck, controllers.posts.removeById]);

app.post("/register", controllers.auth.register);

app.post("/login", controllers.auth.login);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
