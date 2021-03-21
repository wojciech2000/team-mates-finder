import {cleanup, fireEvent, render} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Team from "./Team";
import InfoModal from "../InfoModal/InfoModal";

import {APPLY_TO_TEAM, GET_TEAM, GET_USERS} from "../../queries";
import {MockedProvider} from "@apollo/client/testing";
import {InfoContext, InfoProvider} from "../../context/infoContext";
import {AuthContext, AuthProvider} from "../../context/authContext";
import {BrowserRouter as Router} from "react-router-dom";

afterEach(cleanup);

const mocks = [
  {
    request: {
      query: GET_TEAM,
      variables: {
        id: "1",
      },
    },
    result: {
      data: {
        getTeam: {
          id: "1",
          founder: "founder",
          name: "team1",
          positions: [
            {id: "6051f42ee3a29730f0600372", nick: "founder", position: "Top"},
            {id: "6051f43de3a29730f0600373", nick: "nick1", position: "Jungle"},
            {id: null, nick: null, position: "ADC", invited: "nick2"},
            {id: null, nick: null, position: "Supp"},
          ],
        },
      },
    },
  },
  {
    request: {
      query: APPLY_TO_TEAM,
      variables: {
        id: "1",
        founder: "founder",
        position: "Supp",
      },
    },
    result: {
      data: {
        applyToTeam: {
          nick: "nick2",
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
              secondary: "Jungle",
            },
            team: null,
          },
        ],
      },
    },
  },
];

const mocksError = [
  {
    request: {
      query: GET_TEAM,
      variables: {
        id: "1",
      },
    },
    error: new Error("An error occurred"),
  },
];

describe("Team component", () => {
  it("should disply loading component", () => {
    const {getByTestId} = render(
      <MockedProvider>
        <InfoProvider>
          <InfoContext.Consumer>
            {() => (
              <Router>
                <Team location={{id: "1"}} />
              </Router>
            )}
          </InfoContext.Consumer>
        </InfoProvider>
      </MockedProvider>,
    );

    const loading = getByTestId("loading");
    expect(loading).toBeInTheDocument();
  });

  it("should disply error component", async () => {
    const {findByTestId} = render(
      <MockedProvider mocks={mocksError} addTypename={false}>
        <InfoProvider>
          <InfoContext.Consumer>
            {() => (
              <Router>
                <Team location={{id: "1"}} />
              </Router>
            )}
          </InfoContext.Consumer>
        </InfoProvider>
      </MockedProvider>,
    );

    const error = await findByTestId("error");
    expect(error).toBeInTheDocument();
  });

  it("should disply team's name and founder", async () => {
    const {findByText, findAllByText} = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <InfoProvider>
          <InfoContext.Consumer>
            {() => (
              <Router>
                <Team location={{id: "1"}} />
              </Router>
            )}
          </InfoContext.Consumer>
        </InfoProvider>
      </MockedProvider>,
    );

    const teamName = await findByText("team1");
    //there is two names of founder on in founder's name and one in taken positions
    const founder = await findAllByText("founder");

    expect(teamName).toBeInTheDocument();
    expect(founder).toBeTruthy();
  });

  it("should redirect to Team component on click user's name", async () => {
    const {findByText} = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <InfoProvider>
          <InfoContext.Consumer>
            {() => (
              <Router>
                <Team location={{id: "1"}} />
              </Router>
            )}
          </InfoContext.Consumer>
        </InfoProvider>
      </MockedProvider>,
    );

    const user = await findByText("nick1");
    fireEvent.click(user);

    expect(window.location.pathname).toBe("/player/nick1");
  });

  it("send application to the team being unlogged", async () => {
    const {findByTestId} = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AuthProvider>
          <AuthContext.Consumer>
            {() => (
              <InfoProvider>
                <InfoContext.Consumer>
                  {() => (
                    <Router>
                      <InfoModal />
                      <Team location={{id: "1"}} />
                    </Router>
                  )}
                </InfoContext.Consumer>
              </InfoProvider>
            )}
          </AuthContext.Consumer>
        </AuthProvider>
      </MockedProvider>,
    );

    const applyButton = await findByTestId("SuppApplyButton");
    fireEvent.click(applyButton);

    const infoModal = await findByTestId("infoModal");
    expect(infoModal.textContent).toBe("You have to be logged in");
  });

  it("send application to the team", async () => {
    const {findByTestId} = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AuthProvider value={{id: "0"}}>
          <AuthContext.Consumer>
            {() => (
              <InfoProvider>
                <InfoContext.Consumer>
                  {() => (
                    <Router>
                      <InfoModal />
                      <Team location={{id: "1"}} />
                    </Router>
                  )}
                </InfoContext.Consumer>
              </InfoProvider>
            )}
          </AuthContext.Consumer>
        </AuthProvider>
      </MockedProvider>,
    );

    const applyButton = await findByTestId("SuppApplyButton");
    fireEvent.click(applyButton);

    const infoModal = await findByTestId("infoModal");
    expect(infoModal.textContent).toBe("Sent application to the team");
  });
});
