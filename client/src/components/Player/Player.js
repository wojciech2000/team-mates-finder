import {gql, useQuery} from "@apollo/client";
import React, {Fragment} from "react";

const GET_USER = gql`
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

export default function Player(props) {
  const id = props.match.params.id;
  const {loading, data, error} = useQuery(GET_USER, {variables: {id}});

  return (
    <Fragment>
      {loading
        ? "Loading..."
        : error
        ? "Error."
        : data && (
            <div className="wrapper">
              <div className="player">
                <div className="player__data">
                  <span className="player__description">Nick: </span>
                  <span className="player__content">{data.getUser.nick}</span>
                </div>
                <div className="player__data">
                  <span className="player__description">Server: </span>
                  <span className="player__content">
                    {data.getUser.server.serverName}
                  </span>
                </div>
                <div className="player__data">
                  <span className="player__description">Positions: </span>
                  <span className="player__content">
                    {data.getUser.position.primary}
                    {data.getUser.position.secondary &&
                      " | " + data.getUser.position.secondary}
                  </span>
                </div>
                <div className="player__data">
                  <span className="player__description">Mains: </span>
                  <span className="player__content player__content--champs">
                    {data.getUser.mainChampions.map((champ, id) =>
                      id === 0 ? champ + " " : " | " + champ,
                    )}
                  </span>
                </div>

                {data.getUser.team ? (
                  <div className="player__data">
                    <span className="player__description">Team: </span>
                    <span className="player__content">
                      {data.getUser.team.name}
                    </span>
                  </div>
                ) : (
                  <div className="player__data player__data--button">
                    <button className="player__add">Add to the team</button>
                  </div>
                )}
              </div>
            </div>
          )}
    </Fragment>
  );
}
