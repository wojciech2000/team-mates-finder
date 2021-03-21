import {fireEvent, render} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Register from "./Register";
import InfoModal from "../InfoModal/InfoModal";

import {GET_USERS, REGISTER_USER} from "../../queries";
import {MockedProvider} from "@apollo/client/testing";
import {InfoContext, InfoProvider} from "../../context/infoContext";
import {BrowserRouter as Router} from "react-router-dom";
import {createMemoryHistory} from "history";

const mocksEmptyCredentials = [
  {
    request: {
      query: REGISTER_USER,
      variables: {
        login: "",
        email: "",
        password: "",
        confirmPassword: "",
        server: "BR", //default value in input select
        nick: "",
        primary: "Top", //default value in input select
        secondary: "Top", //default value in input select
      },
    },
    result: {
      errors: [
        {
          extensions: {
            errors: {
              login: "Login must not be empty",
              email: "Email must not be empty",
              password: "Password must not be empty",
            },
          },
        },
      ],
    },
  },
];

const mocksCorrectCredentials = [
  {
    request: {
      query: REGISTER_USER,
      variables: {
        login: "user1",
        email: "user1@email.com",
        password: "password1",
        confirmPassword: "password1",
        server: "BR", //default value in input select
        nick: "nick1",
        primary: "Top", //default value in input select
        secondary: "Mid", //default value in input select
      },
    },
    result: {
      data: {
        register: {
          id: "1",
          nick: "nick1",
        },
      },
    },
  },
  {
    request: {
      query: GET_USERS,
    },
    result: {
      data: {
        getUsers: [
          {
            id: "1",
            nick: "nick1",
            messages: [],
            position: {
              primary: "Top",
              secondary: "Mid",
            },
            team: null,
          },
        ],
      },
    },
  },
];

describe("Register component", () => {
  it("should display error if user didn't type any credentials", async () => {
    const {getByTestId, findByTestId} = render(
      <MockedProvider mocks={mocksEmptyCredentials} addTypename={false}>
        <InfoProvider>
          <InfoContext.Consumer>
            {() => (
              <Router>
                <InfoModal />
                <Register />
              </Router>
            )}
          </InfoContext.Consumer>
        </InfoProvider>
      </MockedProvider>,
    );

    const registerButton = getByTestId("registerButton");
    fireEvent.click(registerButton);

    const infoModal = await findByTestId("infoModal");

    expect(infoModal.innerHTML).toBe(
      "<span>Login must not be empty</span>" +
        "<span>Email must not be empty</span>" +
        "<span>Password must not be empty</span>",
    );
  });

  it("should display message and redirect to /login if user type correct credentials", async () => {
    const history = createMemoryHistory();
    const {getByTestId, findByTestId, debug} = render(
      <MockedProvider mocks={mocksCorrectCredentials} addTypename={false}>
        <InfoProvider>
          <InfoContext.Consumer>
            {() => (
              <Router>
                <InfoModal />
                <Register history={history} />
              </Router>
            )}
          </InfoContext.Consumer>
        </InfoProvider>
      </MockedProvider>,
    );

    const login = getByTestId("loginRegister");
    const email = getByTestId("emailRegister");
    const password = getByTestId("passwordRegister");
    const confirmPassword = getByTestId("confirmPasswordRegister");
    const server = getByTestId("serverRegister");
    const nick = getByTestId("nickRegister");
    const primaryPosition = getByTestId("primaryPositionRegister");
    const secondaryPosition = getByTestId("secondaryPositionRegister");

    fireEvent.change(login, {target: {value: "user1"}});
    fireEvent.change(email, {target: {value: "user1@email.com"}});
    fireEvent.change(password, {target: {value: "password1"}});
    fireEvent.change(confirmPassword, {target: {value: "password1"}});
    fireEvent.change(server, {target: {value: "BR"}});
    fireEvent.change(nick, {target: {value: "nick1"}});
    fireEvent.change(primaryPosition, {target: {value: "Top"}});
    fireEvent.change(secondaryPosition, {target: {value: "Mid"}});

    const registerButton = getByTestId("registerButton");
    fireEvent.click(registerButton);

    const infoModal = await findByTestId("infoModal");

    expect(infoModal.textContent).toBe("User has been added");
    expect(history.location.pathname).toBe("/login");
  });
});
