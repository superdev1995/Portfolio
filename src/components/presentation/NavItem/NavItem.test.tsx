import ComponentTester from "../../../utilities/ComponentTester";
import NavItem from "./NavItem";

const component = new ComponentTester(NavItem)
  .withDefaultProps({
    href: "/"
  })
  .withDefaultChildren("Nav item");

describe("[connected] <NavItem />", () => {
  describe("when isSelected is false", () => {
    const { wrapper } = component
      .withProps({
        isSelected: false
      })
      .mount();

    beforeAll(() => {
      jest.clearAllMocks();
    });

    it("doesn't add the isSelected class", () => {
      expect(wrapper.find(".isSelected")).toHaveLength(0);
    });

    it("renders an Link", () => {
      expect(wrapper.find("Link")).toHaveLength(1);
    });

    it("matches snapshot", () => {
      expect(wrapper.render()).toMatchSnapshot();
    });
  });

  describe("when isSelected is true", () => {
    const { wrapper } = component
      .withProps({
        isSelected: true
      })
      .mount();

    beforeAll(() => {
      jest.clearAllMocks();
    });

    it("adds the isSelected class", () => {
      expect(wrapper.find(".isSelected")).toHaveLength(1);
    });

    it("doesn't render a Link", () => {
      expect(wrapper.find("Link")).toHaveLength(0);
    });

    it("matches snapshot", () => {
      expect(wrapper.render()).toMatchSnapshot();
    });
  });
});
