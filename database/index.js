const mongoose = require('mongoose');
const models = require('./models');

mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const db = mongoose.connection;
db.on('error', () => console.log('some DB error'));
db.once('open', () => {
  console.log('DB connected');
});

module.exports = {
  db,
  models,
};
