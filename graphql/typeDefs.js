const {gql} = require("apollo-server");

const typeDefs = gql`
  #Authentication and authorization
  input RegisterInput {
    login: String!
    email: String!
    password: String!
    confirmPassword: String!
    server: Server!
  }

  type Token {
    token: String!
  }

  type User {
    login: String!
    email: String!
    password: String!
    nick: String!
    server: ServerData!
    position: Position!
    mainChampions: [String]!
  }

  #User configurations
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

  type ServerData {
    serverName: String
    serverCode: String
  }

  enum Positions {
    Top
    Jungle
    Mid
    ADC
    Supp
  }

  type Position {
    primary: String!
    secondary: String
  }

  # Query & Mutation

  type Query {
    login(login: String!, password: String!): Token!
  }

  type Mutation {
    register(registerInput: RegisterInput): User
    updateNick(nick: String!): User
    updateServer(server: Server): User
    updatePosition(primary: Positions!, secondary: Positions): User
    updateMainChampions(champions: [String]): User
  }
`;

module.exports = typeDefs;
