const {model, Schema} = require("mongoose");

const teamSchema = new Schema({
  name: String,
  founder: String,
  membersAmount: Number,
  maxMembersAmount: Number,
  positions: [
    {
      nick: String,
      invited: String,
      position: String,
    },
  ],
});

module.exports = model("Team", teamSchema);
