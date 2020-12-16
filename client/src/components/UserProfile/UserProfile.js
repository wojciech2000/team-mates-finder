import React, {Fragment} from "react";
import {useQuery} from "@apollo/client";

import {GET_USER_PROFILE} from "../../queries";

export default function UserProfile(props) {
  const id = props.match.params.id;

  const {loading, data, error} = useQuery(GET_USER_PROFILE, {variables: {id}});

  return (
    <Fragment>
      {loading
        ? "Loading..."
        : error
        ? "Error..."
        : data && (
            <div className="wrapper">
              <div className="profile">
                <div className="profile__data-wrapper">
                  <div className="profile__data">
                    <span className="profile__description">Nick: </span>
                    <span className="profile__content">
                      {data.getUser.nick}
                    </span>
                  </div>
                  <span className="profile__edit">edit</span>
                </div>

                <div className="profile__data-wrapper">
                  <div className="profile__data">
                    <span className="profile__description">Server: </span>
                    <span className="profile__content">
                      {data.getUser.server.serverName}
                    </span>
                  </div>
                  <span className="profile__edit">edit</span>
                </div>

                <div className="profile__data-wrapper">
                  <div className="profile__data">
                    <span className="profile__description">Positions: </span>
                    <span className="profile__content">
                      {data.getUser.position.primary}
                      {data.getUser.position.secondary &&
                        " | " + data.getUser.position.secondary}
                    </span>
                  </div>
                  <span className="profile__edit">edit</span>
                </div>

                <div className="profile__data-wrapper">
                  <div className="profile__data">
                    <span className="profile__description">Mains: </span>
                    <span className="profile__content profile__content--champs">
                      {data.getUser.mainChampions.length === 0
                        ? "(empty)"
                        : data.getUser.mainChampions.map((champ, id) =>
                            id === 0 ? champ + " " : " | " + champ,
                          )}
                    </span>
                  </div>
                  <span className="profile__edit">edit</span>
                </div>

                <div className="profile__data-wrapper">
                  <div className="profile__data">
                    <span className="profile__description">Team: </span>
                    <span className="profile__content">
                      {!data.getUser.team ? "(none)" : data.getUser.team.name}
                    </span>
                  </div>
                  <span className="profile__edit">edit</span>
                </div>
              </div>
            </div>
          )}
    </Fragment>
  );
}
