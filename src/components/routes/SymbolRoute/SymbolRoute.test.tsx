import ComponentTester from "../../../utilities/ComponentTester";
import SymbolRoute from "./SymbolRoute";

const component = new ComponentTester(SymbolRoute, true);

describe("[routes] <SymbolRoute />", () => {
  it("renders correctly", () => {
    const { wrapper } = component.mount();

    expect(wrapper.render()).toMatchSnapshot();
  });
});
