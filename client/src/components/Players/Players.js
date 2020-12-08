import React from "react";

export default function Players() {
  return (
    <section className="players">
      <div className="header-table">
        <h2 className="header-table__title">Players</h2>
        <button className="header-table__subtitle">Teams</button>
      </div>

      <div className="table">
        <input
          type="text"
          className="table__find-player"
          placeholder="Search player..."
        />
        <select
          name="cars"
          id="cars"
          form="carform"
          className="table__find-position"
        >
          <option value="">All</option>
          <option value="Top">Top</option>
          <option value="Jungle">Jungle</option>
          <option value="Mid">Mid</option>
          <option value="ADC">ADC</option>
          <option value="Supp">Supp</option>
        </select>
        <div className="table__id">ID</div>
        <div className="table__players-name">Player's name</div>
        <div className="table__position">Position</div>
        <div className="table__status">Status</div>

        <div className="data">
          <ul>
            <li className="data__player">
              <span className="data__id">1</span>
              <span className="data__players-name">Absley</span>
              <span className="data__position">Jungle</span>
              <span className="data__status">Free</span>
            </li>
            <li className="data__player">
              <span className="data__id">1</span>
              <span className="data__players-name">Absley</span>
              <span className="data__position">Jungle</span>
              <span className="data__status">Free</span>
            </li>
            <li className="data__player">
              <span className="data__id">1</span>
              <span className="data__players-name">Absley</span>
              <span className="data__position">Jungle</span>
              <span className="data__status">Free</span>
            </li>
            <li className="data__player">
              <span className="data__id">32</span>
              <span className="data__players-name">Absley</span>
              <span className="data__position">Jungle</span>
              <span className="data__status">Free</span>
            </li>
            <li className="data__player">
              <span className="data__id">1</span>
              <span className="data__players-name">Absley</span>
              <span className="data__position">Jungle</span>
              <span className="data__status">Free</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
