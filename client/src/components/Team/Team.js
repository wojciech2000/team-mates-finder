import {gql, useQuery} from "@apollo/client";
import React, {Fragment} from "react";

const GET_TEAM = gql`
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

export default function Team(props) {
  const id = props.match.params.id;

  const {loading, data, error} = useQuery(GET_TEAM, {variables: {id}});

  data && console.log(data);

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
                              <button className="positions__apply">
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
