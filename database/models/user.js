const mongoose = require("mongoose");
const { ObjectId: ID } = mongoose;
const jwt = require("jsonwebtoken");
const pwd = require("password-hash");

const schema = new mongoose.Schema(
  {
    login: String,
    password: String,
    posts: [{ type: ID, ref: "Post" }],
    isAdmin: Boolean
  },
  { versionKey: false }
);

schema.pre("save", async function beforeSave(next) {
  if (this.password && this.isModified("password")) {
    this.password = await pwd.generate(this.password);
  }
  await next();
});

schema.methods.toJSON = function toJSON() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

schema.methods.verifyPassword = async function verifyPassword(plainPassword) {
  return pwd.verify(plainPassword, this.password);
};

schema.methods.jwtSign = async function jwtSign() {
  const obj = this.toObject();
  return jwt.sign(obj, process.env.SECRET_KEY);
};

schema.statics.jwtVerify = async function jwtVerify(token) {
  const { _id } = jwt.verify(token, process.env.SECRET_KEY);
  return this.findById(_id);
};

module.exports = mongoose.model("User", schema);
