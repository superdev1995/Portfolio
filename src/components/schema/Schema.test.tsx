import { render } from "enzyme";
import * as React from "react";

import Schema from "./Schema";

const setup = (fn: any, fromTestProps?: any) => {
  const props = {
    ...fromTestProps
  };

  return {
    actual: fn(<Schema {...props} />),
    props
  };
};

describe("[schema] <Schema />", () => {
  it("renders correctly", () => {
    const { actual } = setup(render);
    expect(actual).toMatchSnapshot();
  });

  it("renders correctly when isPretty=true", () => {
    const { actual } = setup(render, { isPretty: true });
    expect(actual).toMatchSnapshot();
  });
});
