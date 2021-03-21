import {fireEvent, render} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Login from "./Login";
import InfoModal from "../InfoModal/InfoModal";

import {MockedProvider} from "@apollo/client/testing";
import {InfoContext, InfoProvider} from "../../context/infoContext";
import {BrowserRouter as Router} from "react-router-dom";
import {LOGIN_USER} from "../../queries";
import {createMemoryHistory} from "history";

const mocksEmptyCredentials = [
  {
    request: {
      query: LOGIN_USER,
      variables: {
        login: "",
        password: "",
      },
    },
    result: {
      errors: [
        {
          extensions: {
            errors: {
              login: "You have already invited someone on this position",
              password: "You have already invited someone on this position",
            },
          },
        },
      ],
    },
  },
];

const mocksWrongCredentials = [
  {
    request: {
      query: LOGIN_USER,
      variables: {
        login: "user1",
        password: "password2",
      },
    },
    result: {
      errors: [
        {
          extensions: {
            errors: {
              general: "Wrong credentials",
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
      query: LOGIN_USER,
      variables: {
        login: "user1",
        password: "password1",
      },
    },
    result: {
      data: {
        login: {
          id: "1",
          login: "user1",
          token: "abcd",
          nick: "nick1",
        },
      },
    },
  },
];

describe("Login component", () => {
  it("should display error if user didn't type any credentials", async () => {
    const {getByTestId, findByTestId} = render(
      <MockedProvider mocks={mocksEmptyCredentials} addTypename={false}>
        <InfoProvider>
          <InfoContext.Consumer>
            {() => (
              <Router>
                <InfoModal />
                <Login />
              </Router>
            )}
          </InfoContext.Consumer>
        </InfoProvider>
      </MockedProvider>,
    );

    const logInButton = getByTestId("logInButton");
    fireEvent.click(logInButton);

    const infoModal = await findByTestId("infoModal");

    expect(infoModal.innerHTML).toBe(
      "<span>You have already invited someone on this position</span>" +
        "<span>You have already invited someone on this position</span>",
    );
  });

  it("should display error if user typed wrong credentials", async () => {
    const {getByTestId, findByTestId} = render(
      <MockedProvider mocks={mocksWrongCredentials} addTypename={false}>
        <InfoProvider>
          <InfoContext.Consumer>
            {() => (
              <Router>
                <InfoModal />
                <Login />
              </Router>
            )}
          </InfoContext.Consumer>
        </InfoProvider>
      </MockedProvider>,
    );

    const login = getByTestId("loginLogin");
    const password = getByTestId("passwordLogin");

    fireEvent.change(login, {target: {value: "user1"}});
    fireEvent.change(password, {target: {value: "password2"}});

    const logInButton = getByTestId("logInButton");
    fireEvent.click(logInButton);

    const infoModal = await findByTestId("infoModal");

    expect(infoModal.textContent).toBe("Wrong credentials");
  });

  it("should display message and redirect to /home if user type correct credentials", async () => {
    const history = createMemoryHistory();

    const {getByTestId, findByTestId} = render(
      <MockedProvider mocks={mocksCorrectCredentials} addTypename={false}>
        <InfoProvider>
          <InfoContext.Consumer>
            {() => (
              <Router>
                <InfoModal />
                <Login history={history} />
              </Router>
            )}
          </InfoContext.Consumer>
        </InfoProvider>
      </MockedProvider>,
    );

    const login = getByTestId("loginLogin");
    const password = getByTestId("passwordLogin");

    fireEvent.change(login, {target: {value: "user1"}});
    fireEvent.change(password, {target: {value: "password1"}});

    const logInButton = getByTestId("logInButton");
    fireEvent.click(logInButton);

    const infoModal = await findByTestId("infoModal");

    expect(infoModal.textContent).toBe("Logged in");
    expect(history.location.pathname).toBe("/home");
  });
});
