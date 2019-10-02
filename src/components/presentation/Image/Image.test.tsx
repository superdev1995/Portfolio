import ComponentTester from "../../../utilities/ComponentTester";
import Image from "./Image";

const component = new ComponentTester(Image);

const defaultProps = {
  alt: "Alt",
  caption: "Caption",
  className: "Classname",
  onClick: jest.fn(),
  onLoad: jest.fn(),
  src: "Image URL",
  title: "Title"
};

describe("[presentation] <Image />", () => {
  jest.useFakeTimers();

  it("doesn't render anything when src isn't defined", () => {
    const { wrapper } = component
      .withProps({
        ...defaultProps,
        src: undefined
      })
      .render();

    expect(wrapper.html()).toBeNull();
  });

  it("doesn't render the caption when it's not defined", () => {
    const { wrapper } = component
      .withProps({
        ...defaultProps,
        caption: undefined
      })
      .render();

    expect(wrapper.find("figcaption")).toHaveLength(0);
  });

  describe("when all props are defined", () => {
    const { props, wrapper } = component.withProps(defaultProps).mount();

    it("renders with isLoading class initially", () => {
      expect(wrapper.find(".isLoading")).toHaveLength(1);
    });

    it("doesn't render with isRendered class instantly", () => {
      expect(wrapper.find(".isRendered")).toHaveLength(0);
    });

    it("renders a Loader", () => {
      expect(wrapper.find("Loader")).toHaveLength(1);
    });

    it("loads the image", () => {
      wrapper.find("img").simulate("load");
    });

    it("removes isLoading class", () => {
      expect(wrapper.find(".isLoading")).toHaveLength(0);
    });

    it("adds isRendered class", () => {
      expect(wrapper.find(".isRendered")).toHaveLength(1);
    });

    it("removes the Loader", () => {
      expect(wrapper.find("Loader")).toHaveLength(0);
    });

    it("calls the onLoad prop", () => {
      expect(props.onLoad).toHaveBeenCalled();
    });

    it("renders the caption", () => {
      expect(wrapper.find("figcaption")).toHaveLength(1);
    });

    it("has the clickable attributes defined", () => {
      expect(wrapper.find("figure").props()).toMatchObject({
        role: "button",
        tabIndex: 0
      });
    });

    it("clicks the image", () => {
      wrapper.simulate("click");
    });

    it("calls the onClick prop", () => {
      expect(props.onClick).toHaveBeenCalledTimes(1);
    });

    it("presses enter on the image", () => {
      wrapper.simulate("keypress", { key: "Enter" });
    });

    it("calls the onClick prop again", () => {
      expect(props.onClick).toHaveBeenCalledTimes(2);
    });

    it("presses a different key on the image", () => {
      wrapper.simulate("keypress", { key: "Space" });
    });

    it("doesn't call the onClick prop again", () => {
      expect(props.onClick).toHaveBeenCalledTimes(2);
    });

    it("matches snapshot", () => {
      expect(wrapper.render()).toMatchSnapshot();
    });
  });

  describe("when image has already loaded", () => {
    // @ts-ignore-next-line
    Object.defineProperty(global.Image.prototype, "complete", {
      value: true,
      writable: true
    });

    const { wrapper } = component
      .withProps({
        ...defaultProps,
        onLoad: undefined
      })
      .mount();

    it("waits for the 1ms timeout", () => {
      jest.runTimersToTime(1);
      wrapper.update();
    });

    it("doesn't render with isLoading class initially", () => {
      expect(wrapper.find(".isLoading")).toHaveLength(0);
    });

    it("renders with isRendered class instantly", () => {
      expect(wrapper.find(".isRendered")).toHaveLength(1);
    });

    it("doesn't render a Loader", () => {
      expect(wrapper.find("Loader")).toHaveLength(0);
    });
  });

  describe("when onClick isn't defined", () => {
    const { wrapper } = component
      .withProps({
        ...defaultProps,
        onClick: undefined
      })
      .mount();

    it("doesn't have the clickable attributes defined", () => {
      expect(wrapper.find("figure").props()).not.toMatchObject({
        role: "button",
        tabIndex: 0
      });
    });
  });
});
