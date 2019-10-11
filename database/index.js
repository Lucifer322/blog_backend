const mongoose = require("mongoose");
const models = require("./models");

mongoose.connect(`mongodb://localhost:27017/usersdb`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;
db.on("error", () => console.log(process.env.DB_HOST));
db.once("open", () => {
  console.log("DB connected");
});

module.exports = {
  db,
  models
};
