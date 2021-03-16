import {cleanup, findByText, fireEvent, render} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Player from "./Player";
import InfoModel from "../InfoModel/InfoModel";

import {BrowserRouter as Router} from "react-router-dom";
import {MockedProvider} from "@apollo/client/testing";
import {InfoContext, InfoProvider} from "../../context/infoContext";
import {AuthContext, AuthProvider} from "../../context/authContext";
import {GET_USER, INVITE_TO_TEAM, GET_USERS} from "../../queries";

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

const mocksUserWithTeam = [
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
          team: {
            id: "1",
            founder: "nick1",
            name: "team1",
            positions: [{nick: "nick1", position: "Top"}],
          },
        },
      },
    },
  },
];

const mocksError = [
  {
    request: {
      query: GET_USER,
      variables: {
        id: "1",
      },
    },
    error: new Error("An error occurred"),
  },
];

const mocksFounder = [
  {
    //founder
    request: {
      query: GET_USER,
      variables: {
        id: "0",
      },
    },
    result: {
      data: {
        getUser: {
          id: "0",
          nick: "founder",
          mainChampions: [],
          messages: [],
          position: {
            primary: "Jungle",
            secondary: "Top",
          },
          server: {
            serverName: "EUNE",
          },
          team: {
            id: "1",
            founder: "founder",
            name: "team1",
            positions: [
              {nick: "founder", position: "Top"},
              {nick: null, position: "Mid", invited: null},
              {nick: null, position: "ADC", invited: null},
            ],
          },
        },
      },
    },
  },
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
            primary: "Mid",
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
  {
    request: {
      query: INVITE_TO_TEAM,
      variables: {
        id: "1",
        position: "ADC",
      },
    },
    result: {
      data: {
        inviteToTeam: {
          positions: [
            {nick: "founder", position: "Top"},
            {nick: null, position: "Mid", invited: null},
            {nick: null, position: "ADC", invited: "nick1"},
          ],
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
            id: "0",
            nick: "founder",
            mainChampions: [],
            messages: [],
            position: {
              primary: "Jungle",
              secondary: "Top",
            },
            server: {
              serverName: "EUNE",
            },
            team: {
              id: "1",
              founder: "founder",
              name: "team1",
              positions: [
                {nick: "founder", position: "Top"},
                {nick: null, position: "Mid", invited: null},
                {nick: null, position: "ADC", invited: "nick1"},
              ],
            },
          },
          {
            id: "1",
            nick: "nick1",
            messages: [
              {
                id: "1",
                addresseeId: "0",
                position: "ADC",
                read: false,
                message: 'You were invited to the team "team1" on position ADC',
                messageType: "invite",
              },
            ],
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

const mocksFounderAlreadyInvitedPosition = [
  {
    //founder
    request: {
      query: GET_USER,
      variables: {
        id: "0",
      },
    },
    result: {
      data: {
        getUser: {
          id: "0",
          nick: "founder",
          mainChampions: [],
          messages: [],
          position: {
            primary: "Jungle",
            secondary: "Top",
          },
          server: {
            serverName: "EUNE",
          },
          team: {
            id: "1",
            founder: "founder",
            name: "team1",
            positions: [
              {nick: "founder", position: "Top"},
              {nick: null, position: "Mid", invited: null},
              {nick: null, position: "ADC", invited: "nick1"},
            ],
          },
        },
      },
    },
  },
  //player
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
            primary: "Mid",
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
  {
    request: {
      query: INVITE_TO_TEAM,
      variables: {
        id: "1",
        position: "ADC",
      },
    },
    result: {
      errors: [
        {
          extensions: {
            errors: {
              teamEmpty: "You have already invited someone on this position",
            },
          },
        },
      ],
    },
  },
];

describe("Player component", () => {
  it("should disply loading component", () => {
    const {getByTestId} = render(
      <MockedProvider>
        <InfoProvider>
          <InfoContext.Consumer>
            {() => (
              <Router>
                <Player location={{id: "1"}} />
              </Router>
            )}
          </InfoContext.Consumer>
        </InfoProvider>
      </MockedProvider>,
    );

    const loading = getByTestId("loading");
    expect(loading).toBeInTheDocument();
  });

  it("should disply loading component", async () => {
    const {findByText} = render(
      <MockedProvider mocks={mocksError}>
        <InfoProvider>
          <InfoContext.Consumer>
            {() => (
              <Router>
                <Player location={{id: "1"}} />
              </Router>
            )}
          </InfoContext.Consumer>
        </InfoProvider>
      </MockedProvider>,
    );

    const error = await findByText("Error...");
    expect(error).toBeInTheDocument();
  });

  it("should disply user without a team", async () => {
    const {queryByText, findByText} = render(
      <MockedProvider mocks={mocks}>
        <InfoProvider>
          <InfoContext.Consumer>
            {() => (
              <Router>
                <Player location={{id: "1"}} />
              </Router>
            )}
          </InfoContext.Consumer>
        </InfoProvider>
      </MockedProvider>,
    );

    expect(await findByText("nick1")).toBeInTheDocument();
    expect(await queryByText("Team:")).not.toBeInTheDocument();
  });

  it("should disply user with a team", async () => {
    const {findByText} = render(
      <MockedProvider mocks={mocksUserWithTeam}>
        <InfoProvider>
          <InfoContext.Consumer>
            {() => (
              <Router>
                <Player location={{id: "1"}} />
              </Router>
            )}
          </InfoContext.Consumer>
        </InfoProvider>
      </MockedProvider>,
    );

    expect(await findByText("team1")).toBeInTheDocument();
  });

  it("should render logged in founder of the team, that has free position in the team", async () => {
    const {findByText} = render(
      <MockedProvider mocks={mocksFounder}>
        <AuthProvider value={{id: "0", nick: "founder"}}>
          <AuthContext.Consumer>
            {() => (
              <InfoProvider>
                <InfoContext.Consumer>
                  {() => (
                    <Router>
                      <Player location={{id: "1"}} />
                    </Router>
                  )}
                </InfoContext.Consumer>
              </InfoProvider>
            )}
          </AuthContext.Consumer>
        </AuthProvider>
      </MockedProvider>,
    );

    expect(await findByText("Add to the team")).toBeInTheDocument();
  });

  it("send invitation to your team to the user", async () => {
    const {findByText, findByTestId} = render(
      <MockedProvider mocks={mocksFounder} addTypename={false}>
        <AuthProvider value={{id: "0", nick: "founder"}}>
          <AuthContext.Consumer>
            {() => (
              <InfoProvider>
                <InfoContext.Consumer>
                  {() => (
                    <Router>
                      <InfoModel />
                      <Player location={{id: "1"}} />
                    </Router>
                  )}
                </InfoContext.Consumer>
              </InfoProvider>
            )}
          </AuthContext.Consumer>
        </AuthProvider>
      </MockedProvider>,
    );
    const selectPositionInviation = await findByTestId("selectPositionInviation");
    const inviteUserButton = await findByText("Add to the team");

    fireEvent.change(selectPositionInviation, {target: {value: "ADC"}});
    fireEvent.click(inviteUserButton);

    const infoModal = await findByTestId("infoModal");

    expect(infoModal.textContent).toBe("User has been invited");
  });

  it("send invitation to your team to the user, on position which already has invited user", async () => {
    const {findByText, findByTestId} = render(
      <MockedProvider mocks={mocksFounderAlreadyInvitedPosition} addTypename={false}>
        <AuthProvider value={{id: "0", nick: "founder"}}>
          <AuthContext.Consumer>
            {() => (
              <InfoProvider>
                <InfoContext.Consumer>
                  {() => (
                    <Router>
                      <InfoModel />
                      <Player location={{id: "1"}} />
                    </Router>
                  )}
                </InfoContext.Consumer>
              </InfoProvider>
            )}
          </AuthContext.Consumer>
        </AuthProvider>
      </MockedProvider>,
    );
    const selectPositionInviation = await findByTestId("selectPositionInviation");
    const inviteUserButton = await findByText("Add to the team");

    fireEvent.change(selectPositionInviation, {target: {value: "ADC"}});
    fireEvent.click(inviteUserButton);

    const infoModal = await findByTestId("infoModal");

    expect(infoModal.textContent).toBe("You have already invited someone on this position");
  });
});
