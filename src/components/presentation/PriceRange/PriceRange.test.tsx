import ComponentTester from "../../../utilities/ComponentTester";
import PriceRange from "./PriceRange";

const component = new ComponentTester(PriceRange);

describe("[presentation] <PriceRange />", () => {
  describe("when no props are defined", () => {
    const { wrapper } = component.render();

    it("doesn't render anything", () => {
      expect(wrapper.html()).toBeNull();
    });
  });

  describe("when only the min prop is defined", () => {
    const { wrapper } = component
      .withProps({
        min: 99.99
      })
      .shallow();

    it("renders the min price", () => {
      expect(wrapper.find(".PriceRange--min")).toHaveLength(1);
    });

    it("doesn't render the separator", () => {
      expect(wrapper.find(".PriceRange--separator")).toHaveLength(0);
    });

    it("doesn't render the max price", () => {
      expect(wrapper.find(".PriceRange--max")).toHaveLength(0);
    });
  });

  describe("when only the max prop is defined", () => {
    const { wrapper } = component
      .withProps({
        max: 99.99
      })
      .shallow();

    it("doesn't render the min price", () => {
      expect(wrapper.find(".PriceRange--min")).toHaveLength(0);
    });

    it("doesn't render the separator", () => {
      expect(wrapper.find(".PriceRange--separator")).toHaveLength(0);
    });

    it("renders the max price", () => {
      expect(wrapper.find(".PriceRange--max")).toHaveLength(1);
    });
  });

  describe("when both min and max are defined", () => {
    const { wrapper } = component
      .withProps({
        max: 99.99,
        min: 5
      })
      .shallow();

    it("renders the min price", () => {
      expect(wrapper.find(".PriceRange--min")).toHaveLength(1);
    });

    it("renders the separator", () => {
      expect(wrapper.find(".PriceRange--separator")).toHaveLength(1);
    });

    it("renders the max price", () => {
      expect(wrapper.find(".PriceRange--max")).toHaveLength(1);
    });
  });
});
