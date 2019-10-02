import ComponentTester from "../../../utilities/ComponentTester";
import Button from "./Button";

const component = new ComponentTester(Button)
  .withDefaultProps({
    onClick: jest.fn()
  })
  .withDefaultChildren("Button text");

describe("[presentation] <Button />", () => {
  describe("when rendering with default props", () => {
    const { props, wrapper } = component.mount();

    beforeAll(() => {
      jest.clearAllMocks();
    });

    it("clicks the button", () => {
      wrapper.simulate("click");
    });

    it("calls the onClick prop", () => {
      expect(props.onClick).toHaveBeenCalledTimes(1);
    });

    it("matches snapshot", () => {
      expect(wrapper.render()).toMatchSnapshot();
    });
  });

  describe("when isLoading is true", () => {
    const { props, wrapper } = component
      .withProps({
        isLoading: true
      })
      .mount();

    beforeAll(() => {
      jest.clearAllMocks();
    });

    it("renders with isLoading class", () => {
      expect(wrapper.find(".isLoading")).toHaveLength(1);
    });

    it("renders with a Loader", () => {
      expect(wrapper.find("Loader")).toHaveLength(1);
    });

    it("clicks the button", () => {
      wrapper.simulate("click");
    });

    it("doesn't call the onClick prop", () => {
      expect(props.onClick).toHaveBeenCalledTimes(0);
    });

    it("matches snapshot", () => {
      expect(wrapper.render()).toMatchSnapshot();
    });
  });
});
