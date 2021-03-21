import React, {useContext} from "react";
import {Link} from "react-router-dom";
import {useMutation} from "@apollo/client";

import {GET_USERS, REGISTER_USER} from "../../queries";
import useUpdate from "../../utils/useUpdate";
import {InfoContext} from "../../context/infoContext";

export default function Register(props) {
  const {setMessages, setIsMessageError} = useContext(InfoContext);

  const initialState = {
    login: "",
    email: "",
    password: "",
    confirmPassword: "",
    server: "BR",
    nick: "",
    primary: "Top",
    secondary: "Top",
  };

  const {onChangeInput, onSubmitForm, values} = useUpdate(addUserHoist, initialState);

  const [addUser] = useMutation(REGISTER_USER, {
    variables: values,
    update: () => {
      setIsMessageError(false);
      setMessages({error: "User has been added"});
      props.history.push("/login");
    },
    refetchQueries: [{query: GET_USERS}],
    onError: error => {
      setIsMessageError(true);
      setMessages(error.graphQLErrors[0].extensions.errors);
    },
  });

  function addUserHoist() {
    addUser();
  }

  return (
    <div className="wrapper">
      <section className="register">
        <div className="register__header">Register</div>
        <form className="register__form" onSubmit={onSubmitForm}>
          <div className="register__inputs-wrapper">
            <div className="register__inputs">
              <input
                type="text"
                className="register__input"
                placeholder="Login..."
                name="login"
                value={values.login}
                onChange={e => onChangeInput(e)}
                data-testid="loginRegister"
              />
              <input
                type="text"
                className="register__input"
                placeholder="Email..."
                name="email"
                value={values.email}
                onChange={e => onChangeInput(e)}
                data-testid="emailRegister"
              />
              <input
                type="password"
                className="register__input"
                placeholder="Password..."
                name="password"
                value={values.password}
                onChange={e => onChangeInput(e)}
                data-testid="passwordRegister"
              />
              <input
                type="password"
                className="register__input"
                placeholder="Confirm password..."
                name="confirmPassword"
                value={values.confirmPassword}
                onChange={e => onChangeInput(e)}
                data-testid="confirmPasswordRegister"
              />

              <select
                className="register__input"
                name="server"
                value={values.server}
                onChange={e => onChangeInput(e)}
                data-testid="serverRegister"
              >
                <option disabled>Server</option>
                <option value="BR">Brazil</option>
                <option value="EUNE">Europe Nordic East</option>
                <option value="EUW">Europe West </option>
                <option value="LAN">Latin America North</option>
                <option value="LAS">Latin America South</option>
                <option value="NA">North America</option>
                <option value="OCE">Oceania</option>
                <option value="RU">Russia</option>
                <option value="TR">Tureky</option>
                <option value="JP">Japan </option>
                <option value="KR">Korea</option>
              </select>

              <input
                type="text"
                className="register__input"
                placeholder="Nick in LoL..."
                name="nick"
                value={values.nick}
                onChange={e => onChangeInput(e)}
                data-testid="nickRegister"
              />
              <div className="inputs-position">
                <select
                  className="register__input"
                  name="primary"
                  value={values.primary}
                  onChange={e => onChangeInput(e)}
                  data-testid="primaryPositionRegister"
                >
                  <option disabled>Primary</option>
                  <option value="Top">Top</option>
                  <option value="Jungle">Jungle</option>
                  <option value="Mid">Mid</option>
                  <option value="ADC">ADC</option>
                  <option value="Supp">Supp</option>
                </select>

                <select
                  className="register__input"
                  placeholder="Positions..."
                  name="secondary"
                  value={values.secondary}
                  onChange={e => onChangeInput(e)}
                  data-testid="secondaryPositionRegister"
                >
                  <option disabled>Secondary</option>
                  <option value="Top">Top</option>
                  <option value="Jungle">Jungle</option>
                  <option value="Mid">Mid</option>
                  <option value="ADC">ADC</option>
                  <option value="Supp">Supp</option>
                </select>
              </div>
            </div>
          </div>

          <input
            type="submit"
            value="Sign in"
            className="register__submit"
            data-testid="registerButton"
          />
          <Link to="/login" className="register__redirect">
            Log in
          </Link>
        </form>
      </section>
    </div>
  );
}
