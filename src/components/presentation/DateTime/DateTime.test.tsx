import ComponentTester from "../../../utilities/ComponentTester";
import DateTime from "./DateTime";

const component = new ComponentTester(DateTime).withDefaultProps({
  className: "TestDateTime",
  value: "2018-10-20T20:00:00"
});

describe("[presentation] <DateTime />", () => {
  describe("when isRelative is true and isDateOnly is true", () => {
    const { wrapper } = component
      .withProps({
        isDateOnly: true,
        isRelative: true
      })
      .render();

    it("renders with the correct datetime attribute", () => {
      expect(wrapper.attr("datetime")).toBe("2018-10-20");
    });

    it("renders with the correct title attribute", () => {
      expect(wrapper.attr("title")).toBe("Saturday, 20 October 2018");
    });

    it("renders with the correct text content", () => {
      expect(wrapper.text()).toBe("in 10 months");
    });

    it("matches snapshot", () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe("when isRelative is false and isDateOnly is false", () => {
    const { props, wrapper } = component
      .withProps({
        isDateOnly: false,
        isRelative: false
      })
      .render();

    it("renders with the correct datetime attribute", () => {
      expect(wrapper.attr("datetime")).toBe(props.value);
    });

    it("renders with the correct title attribute", () => {
      expect(wrapper.attr("title")).toBe("Saturday, 20 October 2018, 8:00 pm");
    });

    it("renders with the correct text content", () => {
      expect(wrapper.text()).toBe("Saturday, 20 October 2018, 8:00 pm");
    });

    it("matches snapshot", () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe("when isRelative is false and isDateOnly is true", () => {
    const { wrapper } = component
      .withProps({
        isDateOnly: true,
        isRelative: false
      })
      .render();

    it("renders with the correct datetime attribute", () => {
      expect(wrapper.attr("datetime")).toBe("2018-10-20");
    });

    it("renders with the correct title attribute", () => {
      expect(wrapper.attr("title")).toBe("Saturday, 20 October 2018");
    });

    it("renders with the correct text content", () => {
      expect(wrapper.text()).toBe("Saturday, 20 October 2018");
    });

    it("matches snapshot", () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe("when isRelative is false and only time options are defined", () => {
    const { props, wrapper } = component
      .withProps({
        isRelative: false,
        options: {
          hour: "numeric",
          hour12: true,
          minute: "numeric"
        }
      })
      .render();

    it("renders with the correct datetime attribute", () => {
      expect(wrapper.attr("datetime")).toBe(props.value);
    });

    it("renders with the correct title attribute", () => {
      expect(wrapper.attr("title")).toBe("8:00 pm");
    });

    it("renders with the correct text content", () => {
      expect(wrapper.text()).toBe("8:00 pm");
    });

    it("matches snapshot", () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
