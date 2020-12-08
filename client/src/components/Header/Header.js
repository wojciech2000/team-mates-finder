import React from "react";
import {BiLogIn} from "react-icons/bi";

export default function Header() {
  return (
    <header className="header">
      <h1 className="header__title">TMF</h1>
      <div className="menu">
        <button className="menu__login">
          <BiLogIn />
        </button>
      </div>
    </header>
  );
}
