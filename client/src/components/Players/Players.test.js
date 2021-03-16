import {cleanup, fireEvent, render} from "@testing-library/react";
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

const mocksError = [
  {
    request: {
      query: GET_USERS,
    },
    error: new Error("An error occurred"),
  },
];

describe("Players component", () => {
  it("should display loading component", () => {
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

  it("should display players", async () => {
    const {findByText} = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Router>
          <Players />
        </Router>
      </MockedProvider>,
    );

    expect(await findByText("nick1")).toBeInTheDocument;
  });

  it("should display error", async () => {
    const {findByText} = render(
      <MockedProvider mocks={mocksError} addTypename={false}>
        <Router>
          <Players />
        </Router>
      </MockedProvider>,
    );

    expect(await findByText("Error...")).toBeInTheDocument;
  });

  it("should redirect on click", async () => {
    const {findByText, getByTestId} = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Router>
          <Players />
        </Router>
      </MockedProvider>,
    );

    expect(await findByText("nick1")).toBeInTheDocument;

    const userLink = getByTestId("nick1");
    fireEvent.click(userLink);
    const pathname = window.location.pathname;

    expect(pathname).toBe("/player/nick1");
  });
});
