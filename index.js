const express = require('express');
const app = express();
const jsonParser = express.json();
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');
const secretKey = 'luci13';
const pwd = require("password-hash");

const userSchema = new Schema({ login: String, password: String, posts: [] }, { versionKey: false });
const postSchema = new Schema({ img: String, text: String, likes: [], comments: [String], userId: String, approved: Boolean }, { versionKey: false });
const likeSchema = new Schema({ postId: String, userId: String }, { versionKey: false });
const Like = mongoose.model('Like', likeSchema);
const User = mongoose.model('User', userSchema);
const Post = mongoose.model('Post', postSchema);

app.use(express.static(__dirname + "/public"));

mongoose.connect('mongodb://localhost:27017/usersdb', { useNewUrlParser: true }, err => {
  if (err) console.log(err);
  app.listen(3333, () => {
    console.log('Server ON');
  })
});

app.route('/posts')
  .get(async (req, res) => {
    try {
      const posts = await Post.find({})
      res.send(posts)
    } catch (err) {
      console.log(err);
    }
  })
  .post(jsonParser, async (req, res) => {
    if (!Object.keys(req.body).length) {
      return res.sendStatus(400);
    }
    try {
      const token = req.body.token;
      const userId = jwt.verify(token, secretKey).userId;
      const post = await Post.create({ ...req.body, userId, approved: null });
      console.log(`Post ${post._id} waiting for the confirmation`);
      res.send(post);
    } catch (err) {
      console.log(err);
    }
  })
  .delete(async (req, res) => {
    try {
      const posts = await Post.remove({});
      console.log('Posts successfully deleted');
      res.send(posts);
    } catch (err) {
      console.log(err);
    }
  })

app.route('/users')
  .get(async (req, res) => {
    try {
      const users = await User.find({})
      res.send(users)
    } catch (err) {
      console.log(err);
    }
  })
  .delete(async (req, res) => {
    try {
      const users = await User.remove({});
      console.log('Users successfully deleted');
      res.send(users);
    } catch (err) {
      console.log(err);
    }
  })

app.route('/users/:id')
  .get(async (req, res) => {
    try {
      const id = req.body.id;
      const { login, posts } = await User.findById(id);
      res.send({ login, posts });
    } catch (err) {
      console.log(err);
    }
  })
  .delete(async (req, res) => {
    try {
      const id = req.params.id;
      const user = await User.findByIdAndDelete(id);
      console.log(`User ${user._id} successfully deleted`);
      res.send(user);
    } catch (err) {
      console.log(err);
    }
  })

app.route('/posts/:id')
  .get(async (req, res) => {
    try {
      const id = req.params.id;
      const post = await Post.findById(id);
      res.send(post);
    } catch (err) {
      console.log(err);
    }
  })
  .put(jsonParser, async (req, res) => {
    if (!Object.keys(req.body).length) {
      return res.sendStatus(400);
    }
    try {
      const id = req.params.id;
      if (req.body.like) { // когда пришёл лайк, а не апдейт поста
        const { token } = req.body.like;
        const userId = jwt.verify(token, secretKey).userId;
        const like = await Like.create({ userId, postId: id });
        const post = await Post.findById(id);
        const postLikes = post.likes.slice();
        const isLiked = postLikes.filter(el => el.userId === userId).length;
        if (!isLiked) {
          const post = await Post.findByIdAndUpdate(id, { likes: [...postLikes, like] }, { new: true });
          console.log(`Post ${post._id} liked`);
        } else {
          const post = await Post.findByIdAndUpdate(id, { likes: postLikes.concat().filter(el => el.userId != userId) }, { new: true });
          console.log(`Post ${post._id} unliked`);
        }
        res.send(post);
      } else {// когда юзер или админ апдейтит пост, или пришёл коммент
        const post = await Post.findByIdAndUpdate(id, { ...req.body, approved: null }, { new: true });
        console.log(`Post ${post._id} waiting for the confirmation`);
        res.send(post);
      }
    } catch (err) {
      console.log(err);
    }
  })
  .delete(async (req, res) => {
    try {
      const id = req.params.id;
      const post = await Post.findByIdAndDelete(id);
      console.log(`Post ${post._id} successfully deleted`);
      res.send(post);
    } catch (err) {
      console.log(err);
    }
  })

app.post('/register', jsonParser, async (req, res) => {
  try {
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
  } catch (err) {
    console.log(err);
  }
})

app.post('/login', jsonParser, async (req, res) => {
  try {
    const { login, password } = req.body;
    const user = await User.findOne({ login });
    if (pwd.verify(password, user.password)) {
      let token = jwt.sign({ login, userId: user._id }, secretKey);
      console.log(jwt.verify(token, secretKey).userId);
      res.send(token);
      console.log('User successfully logged in');
    } else res.send('Password is invalid');
  } catch (err) {
    console.log(err);
  }
})
