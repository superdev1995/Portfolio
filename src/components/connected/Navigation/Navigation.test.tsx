import * as actions from "../../../actions/root.actions";
import ComponentTester from "../../../utilities/ComponentTester";
import Navigation from "./Navigation";

const component = new ComponentTester(Navigation, true);

describe("[connected] <Navigation />", () => {
  describe("when interacting with the component", () => {
    const { wrapper } = component.mount();

    it("clicks the toggle button", () => {
      wrapper.find("button").simulate("click");
    });

    it("dispatches actions.toggleNavigation", () => {
      expect(
        component.reduxHistory.filter(actions.toggleNavigation.match)
      ).toHaveLength(1);
    });

    it("matches snapshot", () => {
      expect(wrapper.render()).toMatchSnapshot();
    });
  });
});
