import React, {Fragment, useContext} from "react";
import {Link, Redirect} from "react-router-dom";
import {BiLogIn} from "react-icons/bi";
import {FaUser} from "react-icons/fa";

import Messages from "../Messages/Messages";
import {AuthContext} from "../../context/authContext";
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
        <Link to={user ? "/home" : "/players"} data-testid="headerTitle">
          <Redirect to={user ? "/home" : "/players"} />
          TMF
        </Link>
      </h1>
      <div className="menu">
        {!user ? (
          <Link to="/login" className="menu__login" data-testid="redirectLogin">
            <BiLogIn />
          </Link>
        ) : (
          <Fragment>
            <Messages id={id} />

            <Link
              to={{pathname: `/user/${nick}`, id}}
              className="menu__user"
              data-testid="redirectUserProfile"
            >
              <span className="menu__username">{user}</span>

              <FaUser />
            </Link>

            <Link
              to="/players"
              className="menu__logout"
              onClick={logoutonClick}
              data-testid="redirectLogout"
            >
              <BiLogIn />
            </Link>
          </Fragment>
        )}
      </div>
    </header>
  );
}
