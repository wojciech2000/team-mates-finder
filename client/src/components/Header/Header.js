import React, {Fragment, useContext} from "react";
import {BiLogIn} from "react-icons/bi";
import {Link} from "react-router-dom";

import {FaUser} from "react-icons/fa";

import {AuthContext} from "../../context/auth";

export default function Header() {
  const {user, logout} = useContext(AuthContext);

  return (
    <header className="header">
      <h1 className="header__title">
        <Link to="/players">TMF</Link>
      </h1>
      <div className="menu">
        {!user ? (
          <Link to="/login" className="menu__login">
            <BiLogIn />
          </Link>
        ) : (
          <Fragment>
            <Link to="/players" className="menu__user">
              <span className="menu__username">{user}</span>

              <FaUser />
            </Link>
            <Link
              to="/players"
              className="menu__logout"
              onClick={() => logout()}
            >
              <BiLogIn />
            </Link>
          </Fragment>
        )}
      </div>
    </header>
  );
}
