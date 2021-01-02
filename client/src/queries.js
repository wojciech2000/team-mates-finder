import {gql} from "@apollo/client";

export const GET_USERS = gql`
  query {
    getUsers {
      id
      nick
      position {
        primary
        secondary
      }
      team {
        name
      }
    }
  }
`;

export const GET_USER = gql`
  query getUser($id: ID!) {
    getUser(id: $id) {
      id
      nick
      server {
        serverName
      }
      position {
        primary
        secondary
      }
      mainChampions
      team {
        name
      }
      messages {
        read
        message
        messageType
      }
    }
  }
`;

export const REGISTER_USER = gql`
  mutation register(
    $login: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
    $server: Server!
    $nick: String!
    $primary: Positions!
    $secondary: Positions!
  ) {
    register(
      registerInput: {
        login: $login
        email: $email
        password: $password
        confirmPassword: $confirmPassword
        server: $server
        nick: $nick
        position: {primary: $primary, secondary: $secondary}
      }
    ) {
      login
      email
    }
  }
`;

export const LOGIN_USER = gql`
  mutation login($login: String!, $password: String!) {
    login(login: $login, password: $password) {
      token
      login
      id
      nick
    }
  }
`;

export const GET_TEAM = gql`
  query getTeam($id: ID!) {
    getTeam(id: $id) {
      id
      name
      founder
      positions {
        nick
        position
      }
    }
  }
`;

export const GET_TEAMS = gql`
  query {
    getTeams {
      id
      name
      founder
      membersAmount
      maxMembersAmount
      positions {
        nick
        position
      }
    }
  }
`;

export const GET_USER_PROFILE = gql`
  query getUserProfile($id: ID!) {
    getUser(id: $id) {
      id
      nick
      server {
        serverName
      }
      position {
        primary
        secondary
      }
      mainChampions
      team {
        id
        name
      }
    }
  }
`;

export const UPDATE_NICK = gql`
  mutation updateNick($nick: String!) {
    updateNick(nick: $nick) {
      id
      nick
    }
  }
`;

export const UPDATE_SERVER = gql`
  mutation updateServer($server: Server!) {
    updateServer(server: $server) {
      server {
        serverName
        serverCode
      }
    }
  }
`;

export const UPDATE_MAIN_CHAMPIONS = gql`
  mutation updateMainChampions($champions: [String]) {
    updateMainChampions(champions: $champions) {
      mainChampions
    }
  }
`;

export const UPDATE_POSITION = gql`
  mutation updatePosition($primary: Positions!, $secondary: Positions!) {
    updatePosition(primary: $primary, secondary: $secondary) {
      position {
        primary
        secondary
      }
    }
  }
`;

export const CREATE_TEAM = gql`
  mutation createTeam(
    $name: String!
    $maxMembersAmount: Int!
    $positions: [PositionTeamInput!]!
  ) {
    createTeam(
      name: $name
      maxMembersAmount: $maxMembersAmount
      positions: $positions
    ) {
      name
      membersAmount
      maxMembersAmount
      positions {
        nick
        position
      }
    }
  }
`;

export const GET_TEAM_PROFILE = gql`
  query getTeamProfile($id: ID!) {
    getTeam(id: $id) {
      id
      name
      founder
      membersAmount
      maxMembersAmount
      positions {
        nick
        invited
        position
      }
    }
  }
`;

export const SET_READ_TO_TRUE = gql`
  mutation {
    setReadMessages {
      messages {
        read
        message
        messageType
      }
    }
  }
`;

export const UPDATE_TEAM_NAME = gql`
  mutation updateName($name: String!) {
    updateName(name: $name) {
      name
    }
  }
`;

export const UPDATE_POSITIONS_TEAM = gql`
  mutation updatePositions($positions: [PositionTeamInput!]!) {
    updatePositions(positions: $positions) {
      positions {
        nick
        position
        invited
      }
    }
  }
`;
