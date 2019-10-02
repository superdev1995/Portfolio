import { offer } from "../../../models/root.models";
import ComponentTester from "../../../utilities/ComponentTester";
import SaleListing from "./SaleListing";

const component = new ComponentTester(SaleListing).withDefaultProps(
  offer({
    name: "Sale",
    price: 99.99,
    priceCurrency: "USD"
  })
);

describe("[presentation] <SaleListing />", () => {
  describe("when url isn't defined", () => {
    const { wrapper } = component.render();

    it("doesn't render the website meta item", () => {
      expect(wrapper.find(".SaleListing--website")).toHaveLength(0);
    });

    it("matches snapshot", () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe("when url is defined", () => {
    const { wrapper } = component
      .withProps({
        url: "https://ticket.com/id"
      })
      .render();

    it("renders the website meta item", () => {
      expect(wrapper.find(".SaleListing--website")).toHaveLength(1);
    });

    it("matches snapshot", () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
