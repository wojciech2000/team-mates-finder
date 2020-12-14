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
