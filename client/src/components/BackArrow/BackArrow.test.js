import {fireEvent, render} from "@testing-library/react";
import BackArrow from "./BackArrow";

import {BrowserRouter as Router} from "react-router-dom";

describe("BackArrow component", () => {
  it("redirect on click", () => {
    const {getByTestId} = render(
      <Router>
        <BackArrow pathname="teams" />
      </Router>,
    );
    const buckButton = getByTestId("backButton");
    fireEvent.click(buckButton);

    const href = window.location.pathname;
    expect(href).toBe("/teams");
  });
});
