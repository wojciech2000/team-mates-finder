const User = require("../../models/User");

const userResolver = {
  Query: {
    getUsers: () => {
      return "userresolver";
    },
  },
};

module.exports = userResolver;
