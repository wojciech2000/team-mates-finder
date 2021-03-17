const {gql} = require("apollo-server");

const typeDefs = gql`
  input RegisterInput {
    login: String!
    email: String!
    password: String!
    confirmPassword: String!
    server: Server!
    nick: String!
    position: PositionInput
  }

  input PositionInput {
    primary: Positions
    secondary: Positions
  }

  type Token {
    token: String!
  }

  type User {
    id: ID
    login: String!
    email: String!
    password: String
    nick: String
    server: ServerData
    position: Position
    mainChampions: [String]
    team: Team
    messages: [Message]
  }

  type Message {
    id: ID
    addresseeId: ID
    position: Positions
    read: Boolean!
    message: String!
    messageType: String
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
    id: ID!
    name: String!
    founder: String!
    membersAmount: Int!
    maxMembersAmount: Int!
    positions: [PositionTeamType!]
  }

  type PositionTeamType {
    id: ID
    nick: String
    invited: String
    position: Positions!
  }

  input PositionTeamInput {
    id: ID
    nick: String
    position: Positions!
    invited: String
  }

  type userLogged {
    token: String!
    login: String!
    id: ID!
    nick: String!
  }

  # Query & Mutation

  type Query {
    getUsers: [User]
    getUser(id: ID!): User!
    getTeams: [Team]
    getTeam(id: ID!): Team!
  }

  type Mutation {
    login(login: String!, password: String!): userLogged!
    register(registerInput: RegisterInput): User
    updateNick(nick: String!): User
    updateServer(server: Server!): User
    updatePosition(primary: Positions!, secondary: Positions): User
    updateMainChampions(champions: [String]): User
    createTeam(name: String!, maxMembersAmount: Int!, positions: [PositionTeamInput!]!): Team
    updateName(name: String!): Team
    updatePositions(positions: [PositionTeamInput!]!): Team
    inviteToTeam(id: ID!, position: Positions): Team
    setReadMessages: User
    acceptInvitation(messageId: ID!, addresseeId: ID!, position: Positions!): User
    rejectInvitation(messageId: ID!, addresseeId: ID!): User
    applyToTeam(id: ID!, founder: String!, position: Positions): User
    acceptApplication(messageId: ID, addresseeId: ID, position: Positions): User
    rejectApplication(messageId: ID!, addresseeId: ID!, position: Positions): User
    deleteTeam(id: ID!): User
    leaveTeam(id: ID!): User
  }
`;

module.exports = typeDefs;
