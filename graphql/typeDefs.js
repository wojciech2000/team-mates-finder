const {gql} = require("apollo-server");

const typeDefs = gql`
  input RegisterInput {
    login: String!
    email: String!
    password: String!
    confirmPassword: String!
  }

  type User {
    login: String!
    email: String!
    password: String!
  }

  type Token {
    token: String!
  }

  type Query {
    login(login: String!, password: String!): Token!
    getUsers: [User]!
  }

  type Mutation {
    register(registerInput: RegisterInput): User
  }
`;

module.exports = typeDefs;
