const {model, Schema} = require("mongoose");

const userSchema = new Schema({
  login: String,
  email: String,
  password: String,
  nick: String,
});

module.exports = model("User", userSchema);
