import React from "react";
import {BiLogIn} from "react-icons/bi";
import {Link} from "react-router-dom";

export default function Header() {
  return (
    <header className="header">
      <h1 className="header__title">
        <Link to="/players">TMF</Link>
      </h1>
      <div className="menu">
        <Link to="/login" className="menu__login">
          <BiLogIn />
        </Link>
      </div>
    </header>
  );
}
