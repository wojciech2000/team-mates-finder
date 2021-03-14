import {act, cleanup, findByText, render, waitFor} from "@testing-library/react";
import Players from "./Players";

import {MockedProvider} from "@apollo/client/testing";
import {GET_USERS} from "../../queries";

import {BrowserRouter as Router} from "react-router-dom";

afterEach(cleanup);

const mocks = [
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

const errorMocks = [
  {
    request: {
      query: GET_USERS,
    },
    error: new Error("An error occurred"),
  },
];

describe("Players component", () => {
  it("should render loading component", () => {
    const {getByTestId} = render(
      <MockedProvider mocks={mocks}>
        <Router>
          <Players />
        </Router>
      </MockedProvider>,
    );

    const loading = getByTestId("loading");
    expect(loading).toBeInTheDocument;
  });

  it("should render players", async () => {
    await act(async () => {
      const {findByText} = render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <Router>
            <Players />
          </Router>
        </MockedProvider>,
      );

      expect(await findByText("nick1")).toBeInTheDocument;
    });
  });

  it("should display error", async () => {
    const {findByText} = render(
      <MockedProvider mocks={errorMocks} addTypename={false}>
        <Router>
          <Players />
        </Router>
      </MockedProvider>,
    );

    expect(await findByText("Error...")).toBeInTheDocument;
  });
});
