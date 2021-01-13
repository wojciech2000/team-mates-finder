import React, {useEffect, useState} from "react";
import {useQuery} from "@apollo/client";
import {Link} from "react-router-dom";

import {GET_TEAMS} from "../../queries";
import loadingGif from "../../pictures/loading.gif";

export default function Teams() {
  const {loading, data, error} = useQuery(GET_TEAMS);

  const [teams, setTeams] = useState([]);
  const [teamsName, setTeamsName] = useState("");
  const [founder, setFounder] = useState("");

  useEffect(() => {
    data && setTeams(data.getTeams);
  }, [data]);

  const findTeam = () => {
    const filter = teams
      .filter(team =>
        team.name.toLocaleLowerCase().includes(teamsName.toLocaleLowerCase()),
      )
      .filter(team =>
        team.founder.toLocaleLowerCase().includes(founder.toLocaleLowerCase()),
      );

    return filter;
  };

  return (
    <section className="teams">
      <div className="header-table">
        <h2 className="header-table__title">Teams</h2>
        <Link to="/players" className="header-table__subtitle">
          Players
        </Link>
      </div>

      <div className="table">
        <input
          type="text"
          className="table__find-teams-name"
          placeholder="Search team's name..."
          value={teamsName}
          onChange={e => setTeamsName(e.target.value)}
        />
        <input
          type="text"
          className="table__find-founder"
          placeholder="Search founder..."
          value={founder}
          onChange={e => setFounder(e.target.value)}
        />

        <div className="table__id">ID</div>
        <div className="table__teams-name">Teams's name</div>
        <div className="table__positions">Positions</div>
        <div className="table__founder">Founder</div>

        <div className="data">
          {loading ? (
            <div className="loading-wrapper">
              <img src={loadingGif} alt="loading" />
            </div>
          ) : error ? (
            "Error..."
          ) : (
            data && (
              <ul>
                {findTeam().map(
                  (
                    {id, name, membersAmount, maxMembersAmount, founder},
                    key,
                  ) => (
                    <li key={key}>
                      <Link
                        to={{pathname: `/team/${name}`, id}}
                        className="data__team"
                      >
                        <span className="data__id">{key + 1}</span>
                        <span className="data__teams-name">{name}</span>
                        <span className="data__positions">
                          {membersAmount}/{maxMembersAmount}
                        </span>
                        <span className="data__founder">{founder}</span>
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            )
          )}
        </div>
      </div>
    </section>
  );
}
