const {gql} = require("apollo-server");

const typeDefs = gql`
  #Authentication and authorization
  input RegisterInput {
    login: String!
    email: String!
    password: String!
    confirmPassword: String!
  }

  type Token {
    token: String!
  }

  type User {
    login: String!
    email: String!
    password: String!
    nick: String
    server: ServerData
    position: Position
    mainChampions: [String]
    team: Team
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
    primary: String
    secondary: String
  }

  type Team {
    name: String
    founder: String
    membersAmount: Int
    maxMembersAmount: Int
    positions: [PositionTeamType]
  }

  type PositionTeamType {
    nick: String
    position: Positions!
  }

  input PositionTeamInput {
    nick: String
    position: Positions!
  }

  # Query & Mutation

  type Query {
    login(login: String!, password: String!): Token!
    getUsers: [User]
    getTeams: [Team]
  }

  type Mutation {
    register(registerInput: RegisterInput): User
    updateNick(nick: String!): User
    updateServer(server: Server): User
    updatePosition(primary: Positions!, secondary: Positions): User
    updateMainChampions(champions: [String]): User
    updateTeam(
      name: String!
      maxMembersAmount: Int!
      positions: [PositionTeamInput]
    ): Team
  }
`;

module.exports = typeDefs;
