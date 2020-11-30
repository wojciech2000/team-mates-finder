const userResolver = require("./user");

const resolvers = {
  Query: {
    ...userResolver.Query,
  },
};

module.exports = resolvers;
