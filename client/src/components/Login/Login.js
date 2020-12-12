import React from "react";
import {Link} from "react-router-dom";

export default function Login(props) {
  return (
    <div className="wrapper">
      <section className="login">
        <div className="login__header">Log in</div>
        <form className="login__form">
          <div className="login__inputs">
            <input
              type="text"
              className="login__input"
              placeholder="Login..."
            />
            <input
              type="password"
              className="login__input"
              placeholder="Password..."
            />
          </div>
          <input type="submit" value="Go" className="login__submit" />
          <Link to="/register" className="login__redirect">
            Register
          </Link>
        </form>
      </section>
    </div>
  );
}
