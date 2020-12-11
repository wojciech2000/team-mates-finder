import React, {useEffect, useState} from "react";
import {gql, useQuery} from "@apollo/client";
import {Link} from "react-router-dom";

const GET_USERS = gql`
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

export default function Players() {
  const {loading, data, error} = useQuery(GET_USERS);

  const [players, setPlayers] = useState([]);
  const [filterNick, setFilterNick] = useState("");
  const [filterPosition, setFilterPosition] = useState("");

  useEffect(() => {
    data && setPlayers(data.getUsers);
  }, [data]);

  const findNick = () => {
    const filter = players
      .filter(player =>
        player.nick
          .toLocaleLowerCase()
          .includes(filterNick.toLocaleLowerCase()),
      )
      .filter(
        player =>
          (player.position.primary &&
            player.position.primary.includes(filterPosition)) ||
          (player.position.secondary &&
            player.position.secondary.includes(filterPosition)),
      );
    return filter;
  };

  return (
    <section className="players">
      <div className="header-table">
        <h2 className="header-table__title">Players</h2>
        <button className="header-table__subtitle">
          <Link to="/teams">Teams</Link>
        </button>
      </div>

      <div className="table">
        <input
          type="text"
          className="table__find-player"
          placeholder="Search player..."
          value={filterNick}
          onChange={e => setFilterNick(e.target.value)}
        />
        <select
          name="cars"
          id="cars"
          form="carform"
          className="table__find-position"
          onChange={e => setFilterPosition(e.target.value)}
        >
          <option value="">All</option>
          <option value="Top">Top</option>
          <option value="Jungle">Jungle</option>
          <option value="Mid">Mid</option>
          <option value="ADC">ADC</option>
          <option value="Supp">Supp</option>
        </select>
        <div className="table__id">ID</div>
        <div className="table__palyer-nick">Player's nick</div>
        <div className="table__position">Position</div>
        <div className="table__status">Status</div>

        <div className="data">
          <ul>
            {loading
              ? "Loading..."
              : error
              ? "Error..."
              : findNick().map(({id, nick, position, team}, key) => (
                  <li key={key}>
                    <Link to={`/player/${id}`} className="data__player">
                      <span className="data__id">{key + 1}</span>
                      <span className="data__palyer-nick">{nick}</span>
                      <span className="data__position">
                        {position.primary}
                        <br />
                        {position.secondary}
                      </span>
                      <span className="data__status">
                        {team ? (
                          <span className="data__status-taken">Taken</span>
                        ) : (
                          <span className="data__status-free">Free</span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
