const userResolver = require("./user");

const resolvers = {
  Query: {
    ...userResolver.Query,
  },
  Mutation: {
    ...userResolver.Mutation,
  },
};

module.exports = resolvers;
