require("dotenv").config();
const middlewares = require("./middlewares");
const { db } = require("./database");
const express = require("express");
const session = require("express-session");
const app = express();
const controllers = require("./controllers");
const asyncHandler = require("express-async-handler");

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
app.use(asyncHandler(middlewares.getUserFromHeader));

db.once("open", () => {
  app.listen(3333, () => {
    console.log("Server ON");
  });
});

app
  .route("/posts")
  .get(controllers.posts.getAll)
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
  .put([middlewares.loggedInCheck, controllers.posts.update])
  .delete([middlewares.loggedInCheck, controllers.posts.removeById]);

app.post("/comment", [middlewares.loggedInCheck, controllers.comment.create]);

app.post("/like", [middlewares.loggedInCheck, controllers.like.toggle]);

app.post("/register", controllers.auth.register);

app.post("/login", controllers.auth.login);

app.post("/upload", [
  middlewares.loggedInCheck,
  controllers.uploads.uploadArray,
  controllers.uploads.uploadFiles,
  controllers.attachments.create
]);

app.use(middlewares.errorHandler);
