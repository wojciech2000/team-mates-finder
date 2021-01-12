import React, {Fragment, useContext} from "react";
import {Link, Redirect} from "react-router-dom";
import {BiLogIn} from "react-icons/bi";
import {FaUser} from "react-icons/fa";

import Messages from "../Messages/Messages";
import {AuthContext} from "../../context/auth";
import {InfoContext} from "../../context/infoContext";

export default function Header() {
  const {user, nick, id, logout} = useContext(AuthContext);
  const {setIsMessageError, setMessages} = useContext(InfoContext);

  const logoutonClick = () => {
    logout();
    setIsMessageError(false);
    setMessages({message: "Logged out"});
  };

  return (
    <header className="header">
      <h1 className="header__title">
        <Redirect to={user ? "/home" : "/players"} />
        <Link to={user ? "/home" : "/players"}>TMF</Link>
      </h1>
      <div className="menu">
        {!user ? (
          <Link to="/login" className="menu__login">
            <BiLogIn />
          </Link>
        ) : (
          <Fragment>
            <Messages id={id} />

            <Link to={{pathname: `/user/${nick}`, id}} className="menu__user">
              <span className="menu__username">{user}</span>

              <FaUser />
            </Link>

            <Link
              to="/players"
              className="menu__logout"
              onClick={logoutonClick}
            >
              <BiLogIn />
            </Link>
          </Fragment>
        )}
      </div>
    </header>
  );
}
