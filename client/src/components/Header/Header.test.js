import {cleanup, fireEvent, render} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Header from "./Header";

import {BrowserRouter as Router} from "react-router-dom";
import {createMemoryHistory} from "history";
import {InfoContext, InfoProvider} from "../../context/infoContext";
import {AuthContext, AuthProvider} from "../../context/authContext";
import {MockedProvider} from "@apollo/client/testing";
import {GET_USER} from "../../queries";

afterEach(cleanup);

const mocks = [
  {
    request: {
      query: GET_USER,
      variables: {
        id: "1",
      },
    },
    result: {
      data: {
        getUser: {
          id: "1",
          nick: "nick1",
          mainChampions: ["Zac", "Sejuani", "Rengar", "Olaf"],
          messages: [],
          position: {
            primary: "Jungle",
            secondary: "Top",
          },
          server: {
            serverName: "EUNE",
          },
          team: null,
        },
      },
    },
  },
];

describe("Header component", () => {
  it("should redirect to Players component on click, unlogged user", () => {
    const history = createMemoryHistory();
    const {getByTestId} = render(
      <InfoProvider>
        <InfoContext.Consumer>
          {() => (
            <Router>
              <Header history={history} />
            </Router>
          )}
        </InfoContext.Consumer>
      </InfoProvider>,
    );

    const headerTitle = getByTestId("headerTitle");
    fireEvent.click(headerTitle);

    const pathname = window.location.pathname;
    expect(pathname).toBe("/players");
  });

  it("should redirect to Home component on click, logged user", () => {
    const history = createMemoryHistory();
    const {getByTestId} = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AuthProvider value={{user: "user1", nick: "nick1", id: "1"}}>
          <AuthContext.Consumer>
            {() => (
              <InfoProvider>
                <InfoContext.Consumer>
                  {() => (
                    <Router>
                      <Header history={history} />
                    </Router>
                  )}
                </InfoContext.Consumer>
              </InfoProvider>
            )}
          </AuthContext.Consumer>
        </AuthProvider>
      </MockedProvider>,
    );

    const headerTitle = getByTestId("headerTitle");
    fireEvent.click(headerTitle);

    const pathname = window.location.pathname;
    expect(pathname).toBe("/home");
  });

  it("should redirect to Login component on click, unlogged user", () => {
    const history = createMemoryHistory();
    const {getByTestId} = render(
      <AuthContext.Consumer>
        {() => (
          <InfoProvider>
            <InfoContext.Consumer>
              {() => (
                <Router>
                  <Header history={history} />
                </Router>
              )}
            </InfoContext.Consumer>
          </InfoProvider>
        )}
      </AuthContext.Consumer>,
    );

    const redirectLogin = getByTestId("redirectLogin");
    fireEvent.click(redirectLogin);

    const pathname = window.location.pathname;
    expect(pathname).toBe("/login");
  });

  it("should redirect to Players component on click and logout user, logged user", () => {
    const history = createMemoryHistory();
    const {getByTestId} = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AuthProvider
          value={{
            user: "user1",
            nick: "nick1",
            id: "1",
            logout: () => {}, //this function remove user's data from authContext
          }}
        >
          <AuthContext.Consumer>
            {() => (
              <InfoProvider>
                <InfoContext.Consumer>
                  {() => (
                    <Router>
                      <Header history={history} />
                    </Router>
                  )}
                </InfoContext.Consumer>
              </InfoProvider>
            )}
          </AuthContext.Consumer>
        </AuthProvider>
      </MockedProvider>,
    );

    const redirectLogout = getByTestId("redirectLogout");
    fireEvent.click(redirectLogout);

    const pathname = window.location.pathname;
    expect(pathname).toBe("/players");
  });

  it("should redirect to UserProfile component on click, logged user", () => {
    const history = createMemoryHistory();
    const {getByTestId} = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AuthProvider
          value={{
            user: "user1",
            nick: "nick1",
            id: "1",
          }}
        >
          <AuthContext.Consumer>
            {() => (
              <InfoProvider>
                <InfoContext.Consumer>
                  {() => (
                    <Router>
                      <Header history={history} />
                    </Router>
                  )}
                </InfoContext.Consumer>
              </InfoProvider>
            )}
          </AuthContext.Consumer>
        </AuthProvider>
      </MockedProvider>,
    );

    const redirectUserProfile = getByTestId("redirectUserProfile");
    fireEvent.click(redirectUserProfile);
    const pathname = window.location.pathname;

    expect(redirectUserProfile.textContent).toBe("user1");
    expect(pathname).toBe("/user/nick1");
  });
});
