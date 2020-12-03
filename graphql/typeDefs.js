const {gql} = require("apollo-server");

const typeDefs = gql`
  input RegisterInput {
    login: String!
    email: String!
    password: String!
    confirmPassword: String!
    server: Server!
  }

  type ServerData {
    serverName: String
    serverCode: String
  }

  type User {
    login: String!
    email: String!
    password: String!
    nick: String!
    server: ServerData!
  }

  type Token {
    token: String!
  }

  enum Server {
    BR
    EUNE
    EUW
    LAN
    LAS
    NA
    OCE
    RU
    TR
    JP
    KR
  }

  type Query {
    login(login: String!, password: String!): Token!
    getUsers: [User]!
  }

  type Mutation {
    register(registerInput: RegisterInput): User
    updateNick(nick: String!): User
    updateServer(server: Server): User
  }
`;

module.exports = typeDefs;
