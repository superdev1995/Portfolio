import * as messages from "../../../locales/en-NZ";
import ComponentTester from "../../../utilities/ComponentTester";
import Meta from "./Meta";

const component = new ComponentTester(Meta)
  .withDefaultProps({
    className: "TestMeta"
  })
  .withDefaultChildren("Value");

describe("[presentation] <Meta />", () => {
  describe("when label is defined", () => {
    const { wrapper } = component.withProps({ label: "Label" }).render();

    it("renders the label within the label element", () => {
      expect(wrapper.find(".Meta--label").text()).toBe("Label:");
    });

    it("matches snapshot", () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe("when labelIntlId is defined", () => {
    const { wrapper } = component
      .withProps({ labelIntlId: "RELEASED" })
      .render();

    it("renders the intl message within the label element", () => {
      expect(wrapper.find(".Meta--label").text()).toBe(`${messages.RELEASED}:`);
    });

    it("matches snapshot", () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe("when neither label or labelIntlId are defined", () => {
    const { wrapper } = component.render();

    it("doesn't render the label element", () => {
      expect(wrapper.find(".Meta--label")).toHaveLength(0);
    });

    it("matches snapshot", () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
