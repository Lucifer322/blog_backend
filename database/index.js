const mongoose = require("mongoose");
const models = require("./models");

mongoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", () => console.log("some DB error"));
db.once("open", () => {
  console.log("DB connected");
});

module.exports = {
  db,
  models
};
