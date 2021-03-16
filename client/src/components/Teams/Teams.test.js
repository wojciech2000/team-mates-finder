import {fireEvent, render} from "@testing-library/react";
import Teams from "./Teams";

import {BrowserRouter as Router} from "react-router-dom";
import {MockedProvider} from "@apollo/client/testing";
import {GET_TEAMS} from "../../queries";

const mocks = [
  {
    request: {
      query: GET_TEAMS,
    },
    result: {
      data: {
        getTeams: [
          {
            id: "1",
            founder: "nick1",
            maxMembersAmount: 3,
            membersAmount: 2,
            name: "team1",
            positions: [
              {
                nick: "nick1",
                invited: null,
                position: "Top",
              },
            ],
          },
        ],
      },
    },
  },
];

const mocksError = [
  {
    request: {
      query: GET_TEAMS,
    },
    error: new Error("An error occurred"),
  },
];

describe("Teams component", () => {
  it("should render loading component", () => {
    const {getByTestId} = render(
      <MockedProvider mocks={mocks}>
        <Router>
          <Teams />
        </Router>
      </MockedProvider>,
    );

    const loading = getByTestId("loading");
    expect(loading).toBeInTheDocument;
  });

  it("should render teams", async () => {
    const {findByText} = render(
      <MockedProvider mocks={mocks}>
        <Router>
          <Teams />
        </Router>
      </MockedProvider>,
    );

    expect(await findByText("team1")).toBeInTheDocument;
  });

  it("should display error", async () => {
    const {findByText} = render(
      <MockedProvider mocks={mocksError} addTypename={false}>
        <Router>
          <Teams />
        </Router>
      </MockedProvider>,
    );

    expect(await findByText("Error...")).toBeInTheDocument;
  });

  it("should redirect on click", async () => {
    const {findByText, getByTestId} = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Router>
          <Teams />
        </Router>
      </MockedProvider>,
    );

    expect(await findByText("team1")).toBeInTheDocument;

    const teamLink = getByTestId("team1");
    fireEvent.click(teamLink);
    const pathname = window.location.pathname;

    expect(pathname).toBe("/team/team1");
  });
});
