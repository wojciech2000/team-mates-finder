import React from "react";
import {Link} from "react-router-dom";

export default function Teams() {
  return (
    <section className="teams">
      <div className="header-table">
        <h2 className="header-table__title">Teams</h2>
        <button className="header-table__subtitle">
          <Link to="/players">Players</Link>
        </button>
      </div>

      <div className="table">
        <input
          type="text"
          className="table__find-teams-name"
          placeholder="Search team's name..."
        />
        <input
          type="text"
          className="table__find-founder"
          placeholder="Search founder..."
        />

        <div className="table__id">ID</div>
        <div className="table__teams-name">Teams's name</div>
        <div className="table__positions">Positions</div>
        <div className="table__founder">Founder</div>

        <div className="data">
          <ul>
            <li className="data__teams">
              <span className="data__id">1</span>
              <span className="data__teams-name">superteamxx</span>
              <span className="data__positions">2/5</span>
              <span className="data__founder">faker</span>
            </li>
            <li className="data__teams">
              <span className="data__id">1</span>
              <span className="data__teams-name">superteamxx</span>
              <span className="data__positions">2/5</span>
              <span className="data__founder">faker</span>
            </li>
            <li className="data__teams">
              <span className="data__id">1</span>
              <span className="data__teams-name">superteamxx</span>
              <span className="data__positions">2/5</span>
              <span className="data__founder">faker</span>
            </li>
            <li className="data__teams">
              <span className="data__id">1</span>
              <span className="data__teams-name">superteamxx</span>
              <span className="data__positions">2/5</span>
              <span className="data__founder">faker</span>
            </li>
            <li className="data__teams">
              <span className="data__id">1</span>
              <span className="data__teams-name">superteamxx</span>
              <span className="data__positions">2/5</span>
              <span className="data__founder">faker</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
