import {useMutation, useQuery} from "@apollo/client";
import React, {useContext, useState} from "react";
import {AuthContext} from "../../context/auth";

import {GET_USER, INVITE_TO_TEAM, GET_TEAMS} from "../../queries";

export default function Player(props) {
  const {id: founderId, nick} = useContext(AuthContext);

  const [position, setPosition] = useState("");

  const id = props.location.id;
  const {loading, data, error} = useQuery(GET_USER, {variables: {id}});
  const {data: founderData} = useQuery(GET_USER, {
    variables: {id: founderId},
  });

  const [inviteToTeam] = useMutation(INVITE_TO_TEAM, {
    update: (proxy, result) => {
      console.log(result);
    },
    refetchQueries: [{query: GET_TEAMS}],
    onError: error => console.log(error),
  });

  const inviteOnClick = () => {
    inviteToTeam({
      variables: {
        id,
        //if user did change nothing set first available position in db
        position: position
          ? position
          : founderData.getUser.team.positions.filter(
              position => !position.nick && position,
            )[0].position,
      },
    });
  };

  return (
    <div className="wrapper">
      {loading
        ? "Loading..."
        : error
        ? "Error."
        : data && (
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
                founderId &&
                founderData.getUser.team &&
                founderData.getUser.team.founder === nick && (
                  <div className="player__data player__data--button">
                    <select
                      className="player__data__input"
                      value={position}
                      onChange={e => setPosition(e.target.value)}
                    >
                      {founderData.getUser.team.positions.map(
                        ({position: role, nick}, key) =>
                          !nick && <option key={key}>{role}</option>,
                      )}
                    </select>
                    <button className="player__add" onClick={inviteOnClick}>
                      Add to the team
                    </button>
                  </div>
                )
              )}
            </div>
          )}
    </div>
  );
}
