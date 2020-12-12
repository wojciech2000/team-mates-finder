import React from "react";
import {Link} from "react-router-dom";

export default function Register(props) {
  return (
    <div className="wrapper">
      <section className="register">
        <div className="register__header">Log in</div>
        <form className="register__form">
          <div className="register__inputs">
            <input
              type="text"
              className="register__input"
              placeholder="Login..."
            />
            <input
              type="text"
              className="register__input"
              placeholder="Email..."
            />
            <input
              type="password"
              className="register__input"
              placeholder="Password..."
            />
            <input
              type="password"
              className="register__input"
              placeholder="Confirm password..."
            />
          </div>
          <input type="submit" value="Sign in" className="register__submit" />
          <Link to="/login" className="register__redirect">
            Log in
          </Link>
        </form>
      </section>
    </div>
  );
}
