import { STATUS } from "../../../constants/appearance.constants";
import ComponentTester from "../../../utilities/ComponentTester";
import AppearanceStatus from "./AppearanceStatus";

const component = new ComponentTester(AppearanceStatus);

describe("[presentation] <AppearanceStatus />", () => {
  describe("when the value isn't CANCELLED or POSTPONED", () => {
    const { wrapper } = component
      .withProps({
        value: STATUS.SCHEDULED
      })
      .render();

    it("doesn't render anything", () => {
      expect(wrapper.html()).toBeNull();
    });
  });

  describe("when the value is CANCELLED", () => {
    const { wrapper } = component
      .withProps({
        value: STATUS.CANCELLED
      })
      .mount();

    it("renders the correct message", () => {
      expect(wrapper.find("FormattedMessage").prop("id")).toBe("CANCELLED");
    });
  });

  describe("when the value is POSTPONED", () => {
    const { wrapper } = component
      .withProps({
        value: STATUS.POSTPONED
      })
      .mount();

    it("renders the correct message", () => {
      expect(wrapper.find("FormattedMessage").prop("id")).toBe("POSTPONED");
    });
  });
});
