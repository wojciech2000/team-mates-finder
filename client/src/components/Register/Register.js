import React, {useState} from "react";
import {Link} from "react-router-dom";
import {useMutation} from "@apollo/client";

import InfoModel from "../InfoModel/InfoModel";
import loadingGif from "../../pictures/loading.gif";
import {GET_USERS, REGISTER_USER} from "../../queries";
import useUpdate from "../../utils/useUpdate";

export default function Register(props) {
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

  const {onChangeInput, onSubmitForm, values} = useUpdate(
    addUserHoist,
    initialState,
  );

  const [errors, setErrors] = useState({});
  const [correctValidation, setCorrectValidation] = useState({});

  const [addUser, {loading}] = useMutation(REGISTER_USER, {
    update: () => {
      //disable all inputs so user can't type  and click anything
      Array.from(document.querySelectorAll("input")).forEach(
        input => (input.disabled = true),
      );
      setTimeout(() => {
        props.history.push("/login");
      }, 3000);

      setCorrectValidation({message: "User has been added"});
    },
    refetchQueries: [{query: GET_USERS}],
    variables: values,
    onError: error => {
      setErrors(error.graphQLErrors[0].extensions.exception.errors);
    },
  });

  function addUserHoist() {
    addUser();
  }

  return (
    <div className="wrapper">
      <section className="register">
        {(loading || Object.keys(correctValidation).length > 0) && (
          <div className="loading">
            <img src={loadingGif} alt="loading" />
          </div>
        )}
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
              />
              <input
                type="text"
                className="register__input"
                placeholder="Email..."
                name="email"
                value={values.email}
                onChange={e => onChangeInput(e)}
              />
              <input
                type="password"
                className="register__input"
                placeholder="Password..."
                name="password"
                value={values.password}
                onChange={e => onChangeInput(e)}
              />
              <input
                type="password"
                className="register__input"
                placeholder="Confirm password..."
                name="confirmPassword"
                value={values.confirmPassword}
                onChange={e => onChangeInput(e)}
              />

              <select
                className="register__input"
                name="server"
                value={values.server}
                onChange={e => onChangeInput(e)}
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
              />
              <div className="inputs-position">
                <select
                  className="register__input"
                  name="primary"
                  value={values.primary}
                  onChange={e => onChangeInput(e)}
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

          <input type="submit" value="Sign in" className="register__submit" />
          <Link to="/login" className="register__redirect">
            Log in
          </Link>
        </form>
      </section>
      {Object.keys(errors).length > 0 && <InfoModel error={errors} />}
      {Object.keys(correctValidation).length > 0 && (
        <InfoModel info={correctValidation} />
      )}
    </div>
  );
}
