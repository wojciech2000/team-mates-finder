import React, {useState, useContext} from "react";
import {Link} from "react-router-dom";
import {useMutation} from "@apollo/client";

import {LOGIN_USER} from "../../queries";
import InfoModel from "../InfoModel/InfoModel";
import loadingGif from "../../pictures/loading.gif";

import {AuthContext} from "../../context/auth";

export default function Login(props) {
  const context = useContext(AuthContext);

  const [values, setValues] = useState({
    login: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [correctValidation, setCorrectValidation] = useState("");

  const [loginUser] = useMutation(LOGIN_USER, {
    variables: values,
    update: (
      proxy,
      {
        data: {
          login: {token, login, id},
        },
      },
    ) => {
      //disable all inputs so user can't type  and click anything
      Array.from(document.querySelectorAll("input")).forEach(
        input => (input.disabled = true),
      );
      setCorrectValidation("Logged in");
      setTimeout(() => {
        props.history.push("/players");
        context.login({login, id});
        localStorage.setItem("jwtToken", token);
      }, 3000);
    },
    onError: error => {
      setErrors(error.graphQLErrors[0].extensions.exception.errors);
    },
  });

  const onChangeInput = e => {
    setValues({...values, [e.target.name]: e.target.value});
  };

  const login = e => {
    e.preventDefault();
    loginUser();
  };

  return (
    <div className="wrapper">
      <section className="login">
        {correctValidation.length > 0 && (
          <div className="loading">
            <img src={loadingGif} alt="loading" />
          </div>
        )}
        <div className="login__header">Log in</div>
        <form className="login__form" onSubmit={login}>
          <div className="login__inputs">
            <input
              type="text"
              className="login__input"
              placeholder="Login..."
              name="login"
              value={values.name}
              onChange={e => onChangeInput(e)}
            />
            <input
              type="password"
              className="login__input"
              placeholder="Password..."
              name="password"
              value={values.name}
              onChange={e => onChangeInput(e)}
            />
          </div>
          <input type="submit" value="Go" className="login__submit" />
          <Link to="/register" className="login__redirect">
            Register
          </Link>
        </form>
      </section>
      {Object.keys(errors).length > 0 && <InfoModel error={errors} />}
      {correctValidation && <InfoModel info={correctValidation} />}
    </div>
  );
}
