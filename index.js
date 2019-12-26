require('dotenv').config();
require('express-async-errors');
const middlewares = require('./middlewares');
const { db } = require('./database');
const express = require('express');
const session = require('express-session');
const app = express();
const controllers = require('./controllers');
const cors = require('cors');

app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  }),
);
app.use(
  cors({
    'Access-Control-Allow-Origin': '*',
  }),
);
app.use(middlewares.getUserFromHeader);

db.once('open', () => {
  app.listen(process.env.PORT);
});

app.get('/', function(req, res) {
  res.redirect('/posts');
});

app
  .route('/posts')
  .get(controllers.posts.getAll)
  .post([middlewares.loggedInCheck, controllers.posts.create])
  .delete([middlewares.loggedInCheck, middlewares.adminCheck, controllers.posts.remove]);

app
  .route('/users')
  .get([middlewares.loggedInCheck, middlewares.adminCheck, controllers.users.getAll])
  .delete([middlewares.loggedInCheck, middlewares.adminCheck, controllers.users.remove]);

app
  .route('/users/:id')
  .get(controllers.users.getById)
  .delete([middlewares.loggedInCheck, middlewares.adminCheck, controllers.users.removeById]);

app
  .route('/posts/:id')
  .get(controllers.posts.getById)
  .put([middlewares.loggedInCheck, controllers.posts.update])
  .delete([middlewares.loggedInCheck, controllers.posts.removeById]);

app
  .route('/comments')
  .post([middlewares.loggedInCheck, controllers.comments.create])
  .get([middlewares.loggedInCheck, middlewares.adminCheck, controllers.comments.getAll]);

app
  .route('/comment/:id')
  .delete([middlewares.loggedInCheck, controllers.comments.remove])
  .put([middlewares.loggedInCheck, middlewares.adminCheck, controllers.comments.approve]);

app.post('/like', [middlewares.loggedInCheck, controllers.like.toggle]);

app.post('/register', controllers.auth.register);

app.post('/login', controllers.auth.login);

app.post('/upload', [
  middlewares.loggedInCheck,
  controllers.uploads.uploadArray,
  controllers.uploads.uploadFiles,
  controllers.attachments.create,
]);

app.use((req, res, next) => {
  res.sendStatus(404);
});

app.use(middlewares.errorHandler);
