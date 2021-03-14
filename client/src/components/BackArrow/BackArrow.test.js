import {fireEvent, render} from "@testing-library/react";
import BackArrow from "./BackArrow";

import {BrowserRouter as Router} from "react-router-dom";

describe("BackArrow component", () => {
  it("should redirect on click", () => {
    const {getByTestId} = render(
      <Router>
        <BackArrow pathname="teams" />
      </Router>,
    );
    const buckButton = getByTestId("backButton");
    fireEvent.click(buckButton);

    const pathname = window.location.pathname;
    expect(pathname).toBe("/teams");
  });
});
