import {useMutation, useQuery} from "@apollo/client";
import React, {Fragment, useContext} from "react";

import {InfoContext} from "../../context/infoContext";
import {APPLY_TO_TEAM, GET_TEAM} from "../../queries";

export default function Team(props) {
  const id = props.location.id;

  const {loading, data, error} = useQuery(GET_TEAM, {variables: {id}});
  const {setMessages, setIsMessageError} = useContext(InfoContext);

  const [applyToTeam] = useMutation(APPLY_TO_TEAM, {
    update: () => {
      setIsMessageError(false);
      setMessages({error: "Sent application to the team"});
    },
    onError: error => {
      setIsMessageError(true);
      setMessages(error.graphQLErrors[0].extensions.exception.errors);
    },
  });

  const applyToTeamOnClick = e => {
    applyToTeam({
      variables: {
        id: data.getTeam.id,
        founder: data.getTeam.founder,
        position: e.target.dataset.position,
      },
    });
  };

  return (
    <Fragment>
      {loading
        ? "Loading..."
        : error
        ? "Error..."
        : data && (
            <div className="wrapper">
              <section className="team">
                <div className="team__header">
                  <div className="team__name">
                    <span className="team__description">Team's name: </span>
                    <span className="team__content">{data.getTeam.name}</span>
                  </div>
                  <div className="team__founder">
                    <span className="team__description">Founder: </span>
                    <span className="team__content">
                      {data.getTeam.founder}
                    </span>
                  </div>
                </div>
                <div className="positions">
                  <section className="positions__free">
                    <h3 className="positions__title--free">Free positions</h3>
                    <div className="positions__data">
                      {data.getTeam.positions.map(
                        (position, id) =>
                          !position.nick && (
                            <span className="positions__position" key={id}>
                              <span className="positions__description">
                                {position.position}:
                              </span>
                              <button
                                className="positions__apply"
                                data-position={position.position}
                                onClick={applyToTeamOnClick}
                              >
                                Apply
                              </button>
                            </span>
                          ),
                      )}
                    </div>
                  </section>
                  <section className="position__taken">
                    <h3 className="positions__title--taken">Taken positions</h3>
                    <div className="positions__data">
                      {data.getTeam.positions.map(
                        (position, id) =>
                          position.nick && (
                            <span className="positions__position" key={id}>
                              <span className="positions__description">
                                {position.position + ": "}
                              </span>
                              <span className="positions__content">
                                {position.nick}
                              </span>
                            </span>
                          ),
                      )}
                    </div>
                  </section>
                </div>
              </section>
            </div>
          )}
    </Fragment>
  );
}
