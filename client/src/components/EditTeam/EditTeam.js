import React from "react";
import {useQuery} from "@apollo/client";

import {GET_TEAM_PROFILE} from "../../queries";

export default function EditTeam(props) {
  const id = props.match.params.id;

  const {loading, data, error} = useQuery(GET_TEAM_PROFILE, {
    variables: {id},
  });

  data && console.log(data);

  return (
    <div className="wrapper">
      {loading
        ? "Loading..."
        : error
        ? "Error..."
        : data && (
            <div className="edit-team">
              <div className="edit-team__data-wrapper">
                <div className="edit-team__data">
                  <span className="edit-team__description">Team's name: </span>
                  <span className="edit-team__content">
                    {data.getTeam.name}
                  </span>
                </div>
                <div className="edit-team__edit-wrapper">
                  <button className="edit-team__edit" id="nick">
                    edit
                  </button>
                </div>
              </div>

              <div className="edit-team__data-wrapper">
                <div className="edit-team__data">
                  <span className="edit-team__description">Founder:</span>
                  <span className="edit-team__content">
                    {data.getTeam.founder}
                  </span>
                </div>
              </div>

              <div className="edit-team__data-wrapper">
                <div className="edit-team__data">
                  <span className="edit-team__description">
                    Member's amount:
                  </span>
                  <span className="edit-team__content">
                    {data.getTeam.maxMembersAmount}
                  </span>
                </div>
                <div className="edit-team__edit-wrapper">
                  <button className="edit-team__edit" id="nick">
                    edit
                  </button>
                </div>
              </div>
              <div className="edit-team__data-wrapper--members">
                {data.getTeam.positions.map((position, id) => (
                  <div className="member" key={id}>
                    <span className="member__position">
                      {position.position + ": "}
                    </span>
                    <span className="member__nick">
                      {position.nick ? (
                        position.nick
                      ) : position.invited ? (
                        <span className="member__nick--invited">
                          invited - {position.invited}
                        </span>
                      ) : (
                        <span className="member__nick--none">none</span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
    </div>
  );
}
