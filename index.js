const { adminCheck } = require("./middlewares");
const { Like, User, Post, Comment } = require("./models");

const express = require('express');
const app = express();
const jsonParser = express.json();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const secretKey = 'luci13';
const pwd = require("password-hash");

app.use(express.static(__dirname + "/public"));

mongoose.connect('mongodb://localhost:27017/usersdb', { useNewUrlParser: true }, err => {
  if (err) console.log(err);
  app.listen(3333, () => {
    console.log('Server ON');
  })
});

app.route('/posts')
  .get(async (req, res) => {
    const posts = await Post.find({})
    res.send(posts)
  })
  .post(jsonParser, async (req, res) => {
    if (!Object.keys(req.body).length) {
      return res.sendStatus(400);
    }
    const [, token] = req.get('Authorization').split(' ');
    const userId = jwt.verify(token, secretKey).userId;
    const post = await Post.create({ ...req.body, owner: userId, approved: null });
    console.log(`Post ${post._id} waiting for the confirmation`);
    res.send(post);
  })
  .delete(adminCheck, async (req, res) => {
    const posts = await Post.remove({});
    console.log('All posts successfully deleted');
    res.send(posts);
  })

app.route('/users')
  .get(adminCheck, async (req, res) => {
    const users = await User.find({})
    res.send(users)
  })
  .delete(adminCheck, async (req, res) => {
    const users = await User.remove({});
    console.log('Users successfully deleted');
    res.send(users);
  })

app.route('/users/:id')
  .get(async (req, res) => {
    const id = req.body.id;
    const { login, posts } = await User.findById(id);
    res.send({ login, posts });
  })
  .delete(adminCheck, async (req, res) => {
    const id = req.params.id;
    const user = await User.findByIdAndDelete(id);
    console.log(`User ${user._id} successfully deleted`);
    res.send(user);
  })

app.route('/posts/:id')
  .get(async (req, res) => {
    const id = req.params.id;
    const post = await Post.findById(id);
    res.send(post);
  })
  .put(jsonParser, async (req, res) => {
    if (!Object.keys(req.body).length) {
      return res.sendStatus(400);
    }
    const id = req.params.id;
    const [, token] = req.get('Authorization').split(' ');
    const userId = jwt.verify(token, secretKey).userId;
    const post = await Post.findById(id);
    if (req.body.like) { // когда пришёл лайк, а не апдейт поста
      const isLiked = post.likes.some(el => el.userId === userId);
      if (isLiked) {
        const post = await Post.findByIdAndUpdate(id, { $pull: { likes: { $in: { owner: userId } } } }, { new: true });
        console.log(`Post ${post._id} liked`);
      } else {
        const like = await Like.create({ user: userId, post: id });
        const post = await Post.findByIdAndUpdate(id, { $push: { likes: like } }, { new: true });
        console.log(`Post ${post._id} unliked`);
      }
      res.send(post);
    } else if (req.body.comment) {// пришёл коммент
      const { text } = req.body.comment;
      const comment = await Comment.create({ text, post: id, owner: userId });
      const post = await Post.findByIdAndUpdate(id, { $push: { comments: comment } }, { new: true });
      console.log(`Post ${post._id} commented. W8 4 confirmation`);
    } else {// когда юзер или админ апдейтит пост
      const post = await Post.findByIdAndUpdate(id, { ...req.body, approved: null }, { new: true });
      console.log(`Post ${post._id} waiting for the confirmation`);
      res.send(post);
    }
  })
  .delete(async (req, res) => {
    const id = req.params.id;
    const post = await Post.findByIdAndDelete(id);
    console.log(`Post ${post._id} successfully deleted`);
    res.send(post);
  })

app.post('/register', jsonParser, async (req, res) => {
  const { login, password } = req.body;
  if (await User.findOne({ login })) {
    res.send('Login already exist');
  } else {
    const hashedPassword = pwd.generate(password);
    const user = await User.create({ login, password: hashedPassword });
    console.log(`User ${user} successfully created`);
    let token = jwt.sign({ login, userId: user._id }, secretKey);
    res.send(token);
  }
})

app.post('/login', jsonParser, async (req, res) => {
  const { login, password } = req.body;
  const user = await User.findOne({ login });
  if (pwd.verify(password, user.password)) {
    let token = jwt.sign({ login, userId: user._id }, secretKey);
    console.log(jwt.verify(token, secretKey).userId);
    res.send(token);
    console.log('User successfully logged in');
  } else res.send('Password is invalid');
})


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
})