import ComponentTester from "../../../utilities/ComponentTester";
import MetaBar from "./MetaBar";

const component = new ComponentTester(MetaBar).withDefaultProps({
  className: "TestMetaBar"
});

describe("[presentation] <MetaBar />", () => {
  it("doesn't render anything when there are no children", () => {
    const { wrapper } = component.render();

    expect(wrapper.html()).toBeNull();
  });

  describe("when children are defined", () => {
    const { wrapper } = component.withChildren("Child meta").render();

    it("renders the children within the container", () => {
      expect(wrapper.html()).toBe("Child meta");
    });

    it("matches snapshot", () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
