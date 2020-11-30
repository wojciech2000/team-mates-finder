const {gql} = require("apollo-server");

const typeDefs = gql`
  type Query {
    getUsers: String!
  }
`;

module.exports = typeDefs;
