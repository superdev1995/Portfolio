import ComponentTester from "../../../utilities/ComponentTester";
import Price from "./Price";

const component = new ComponentTester(Price).withDefaultProps({
  className: "TestPrice",
  value: 199.99
});

describe("[presentation] <Price />", () => {
  it("renders correctly with default props", () => {
    const { wrapper } = component.render();

    expect(wrapper.text()).toBe("$199.99");
  });

  it("renders correctly with FormattedNumber props defined", () => {
    const { wrapper } = component
      .withProps({
        maximumFractionDigits: 0
      })
      .render();

    expect(wrapper.text()).toBe("$200");
  });
});
