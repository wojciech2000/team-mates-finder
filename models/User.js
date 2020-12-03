const {model, Schema} = require("mongoose");

const userSchema = new Schema({
  login: String,
  email: String,
  password: String,
  nick: String,
  server: {
    serverName: String,
    serverCode: String,
  },
  position: {
    primary: String,
    secondary: String,
  },
});

module.exports = model("User", userSchema);
