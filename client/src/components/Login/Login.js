import React, {useContext} from "react";
import {Link} from "react-router-dom";
import {useMutation} from "@apollo/client";

import {LOGIN_USER} from "../../queries";
import useUpdate from "../../utils/useUpdate";

import {AuthContext} from "../../context/authContext";
import {InfoContext} from "../../context/infoContext";

export default function Login(props) {
  const context = useContext(AuthContext);
  const {setMessages, setIsMessageError} = useContext(InfoContext);

  const initialState = {
    login: "",
    password: "",
  };

  const {onChangeInput, onSubmitForm, values} = useUpdate(loginUserHoist, initialState);

  const [loginUser] = useMutation(LOGIN_USER, {
    variables: values,
    update: (
      proxy,
      {
        data: {
          login: {token, login, id, nick},
        },
      },
    ) => {
      setMessages({message: "Logged in"});
      setIsMessageError(false);
      props.history.push("/home");
      context.login({login, id, nick});
      localStorage.setItem("jwtToken", token);
    },
    onError: error => {
      setIsMessageError(true);
      setMessages(error.graphQLErrors[0].extensions.errors);
    },
  });

  function loginUserHoist() {
    loginUser();
  }

  return (
    <div className="wrapper">
      <section className="login">
        <div className="login__header">Log in</div>
        <form className="login__form" onSubmit={onSubmitForm}>
          <div className="login__inputs">
            <input
              type="text"
              className="login__input"
              placeholder="Login..."
              name="login"
              value={values.name}
              onChange={e => onChangeInput(e)}
              data-testid="loginLogin"
            />
            <input
              type="password"
              className="login__input"
              placeholder="Password..."
              name="password"
              value={values.name}
              onChange={e => onChangeInput(e)}
              data-testid="passwordLogin"
            />
          </div>
          <input type="submit" value="Go" className="login__submit" data-testid="logInButton" />
          <Link to="/register" className="login__redirect">
            Register
          </Link>
        </form>
      </section>
    </div>
  );
}
