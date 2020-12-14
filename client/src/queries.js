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
