const userResolver = require("./user");
const teamResolver = require("./team");

const resolvers = {
  Query: {
    ...userResolver.Query,
    ...teamResolver.Query,
  },
  Mutation: {
    ...userResolver.Mutation,
    ...teamResolver.Mutation,
  },
};

module.exports = resolvers;
