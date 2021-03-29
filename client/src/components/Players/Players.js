import React, {useEffect, useState} from "react";
import {useQuery} from "@apollo/client";
import {Link} from "react-router-dom";

import {GET_USERS} from "../../queries";
import Loading from "../Loading/Loading";
import Error from "../Error/Error";
import useUpdate from "../../utils/useUpdate";

export default function Players() {
  const {loading, data, error} = useQuery(GET_USERS);

  const [players, setPlayers] = useState([]);

  const initialState = {
    nick: "",
    position: "",
    teamStatus: "",
  };

  //null in useUpdate is a callback function needed in login and register components
  const {
    onChangeInput,
    values: {nick, position, teamStatus},
  } = useUpdate(null, initialState);

  useEffect(() => {
    data && setPlayers(data.getUsers);
  }, [data]);

  const filterPlayer = () => {
    const filter = players
      .filter(player => player.nick.toLocaleLowerCase().includes(nick.toLocaleLowerCase()))
      .filter(
        player =>
          player.position.primary.includes(position) ||
          player.position.secondary.includes(position),
      )
      .filter(player => {
        switch (teamStatus) {
          case "Free":
            return !player.team;

          case "Taken":
            return player.team;

          default:
            return player;
        }
      });

    return filter;
  };

  return (
    <section className="players">
      <div className="header-table">
        <h2 className="header-table__title">Players</h2>
        <Link to="/teams" className="header-table__subtitle">
          Teams
        </Link>
      </div>

      <div className="table">
        <input
          type="text"
          className="table__find-player"
          placeholder="Search player..."
          name="nick"
          value={nick}
          onChange={e => onChangeInput(e)}
        />

        <select className="table__find-position" name="position" onChange={e => onChangeInput(e)}>
          <option value="">All</option>
          <option value="Top">Top</option>
          <option value="Jungle">Jungle</option>
          <option value="Mid">Mid</option>
          <option value="ADC">ADC</option>
          <option value="Supp">Supp</option>
        </select>

        <select className="table__find-status" name="teamStatus" onChange={e => onChangeInput(e)}>
          <option value="All">All</option>
          <option value="Free">Free</option>
          <option value="Taken">Taken</option>
        </select>

        <div className="table__id">ID</div>
        <div className="table__palyer-nick">Player's nick</div>
        <div className="table__position">Position</div>
        <div className="table__status">Status</div>
        <div className="data">
          <ul>
            {loading ? (
              <Loading />
            ) : error ? (
              <Error />
            ) : (
              filterPlayer().map(({id, nick, position, team}, key) => (
                <li key={key}>
                  <Link
                    to={{pathname: `/player/${nick}`, id}}
                    className="data__player"
                    data-testid={nick}
                  >
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
              ))
            )}
          </ul>
        </div>
      </div>
    </section>
  );
}
