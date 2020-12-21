import React from "react";
import {Link} from "react-router-dom";

export default function UserHome(props) {
  return (
    <div className="wrapper wrapper-userhome">
      <div className="find-team">
        <aside>
          The traveler knows <br /> where is going
        </aside>
        <button className="find-team__button">
          <Link to="/teams">Join to the team</Link>
        </button>
      </div>
      <div className="find-players">
        <aside>Captain Teemo on duty.</aside>
        <button className="find-players__button">
          <Link to="/players">Find summoners</Link>
        </button>
      </div>
    </div>
  );
}
