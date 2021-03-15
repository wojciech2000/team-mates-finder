import {render} from "@testing-library/react";
import Loading from "./Loading";

describe("Loading component", () => {
  it("should render loading", () => {
    const {getByTestId} = render(<Loading />);
    expect(getByTestId("loading")).toBeInTheDocument;
  });
});
