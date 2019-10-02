import * as messages from "../../../locales/en-NZ";
import ComponentTester from "../../../utilities/ComponentTester";
import { createMockElement, findMockCall } from "../../../utilities/mocks";
import LoadButton from "./LoadButton";

const screenWidth = 1920;
const screenHeight = 1080;

const component = new ComponentTester(LoadButton).withDefaultProps({
  className: "TestLoadButton",
  onLoad: jest.fn()
});

describe("[presentation] <LoadButton />", () => {
  jest.spyOn(window, "addEventListener");
  jest.spyOn(window, "removeEventListener");

  Object.defineProperties(window, {
    innerHeight: {
      value: screenHeight,
      writable: true
    },
    innerWidth: {
      value: screenWidth,
      writable: true
    },
    isServer: {
      value: false,
      writable: true
    }
  });

  describe("when mounting on the client and isScrollLoadEnabled is false", () => {
    let result: ReturnType<typeof component.mount>;

    beforeAll(() => {
      jest.clearAllMocks();

      result = component
        .withProps({
          isScrollLoadEnabled: false
        })
        .mount();
    });

    it("doesn't bind scroll event listener", () => {
      expect(findMockCall(window.addEventListener, "scroll")).toBeUndefined();
    });

    it("doesn't call the onLoad prop", () => {
      expect(result.props.onLoad).toHaveBeenCalledTimes(0);
    });

    it("clicks the button", () => {
      result.wrapper.simulate("click");
    });

    it("calls the onLoad prop", () => {
      expect(result.props.onLoad).toHaveBeenCalledTimes(1);
    });

    it("unmounts component", () => {
      result.wrapper.unmount();
    });

    it("doesn't unbind scroll event listener", () => {
      expect(
        findMockCall(window.removeEventListener, "scroll")
      ).toBeUndefined();
    });
  });

  describe("when mounting on the client and isScrollLoadEnabled is true", () => {
    let result: ReturnType<typeof component.mount>;

    beforeAll(() => {
      jest.clearAllMocks();

      result = component
        .withProps({
          isScrollLoadEnabled: true,
          triggerDistance: 200
        })
        .mount();
    });

    it("binds scroll event listener", () => {
      expect(findMockCall(window.addEventListener, "scroll")).toBeDefined();
    });

    it("calls the onLoad prop instantly", () => {
      expect(result.props.onLoad).toHaveBeenCalledTimes(1);
    });

    it("clears mocks", () => {
      jest.clearAllMocks();
    });

    it("simulate positioning the button off the screen", () => {
      result.wrapper
        .find("LoadButton")
        // @ts-ignore-next-line
        .instance().buttonRef.current = createMockElement(
        100,
        100,
        screenHeight + result.props.triggerDistance,
        0
      );
    });

    it("dispatches a scroll event", () => {
      window.dispatchEvent(new UIEvent("scroll"));
    });

    it("doesn't call the onLoad prop", () => {
      expect(result.props.onLoad).toHaveBeenCalledTimes(0);
    });

    it("simulate positioning the button within the trigger distance of the screen", () => {
      result.wrapper
        .find("LoadButton")
        // @ts-ignore-next-line
        .instance().buttonRef.current = createMockElement(
        100,
        100,
        screenHeight + result.props.triggerDistance - 1,
        0
      );
    });

    it("dispatches a scroll event", () => {
      window.dispatchEvent(new UIEvent("scroll"));
    });

    it("calls the onLoad prop", () => {
      expect(result.props.onLoad).toHaveBeenCalledTimes(1);
    });

    it("clears mocks", () => {
      jest.clearAllMocks();
    });

    it("updates the props to set isScrollLoadEnabled to false", () => {
      result.wrapper.setProps({
        isScrollLoadEnabled: false
      });
    });

    it("unbinds the scroll event listener", () => {
      expect(findMockCall(window.removeEventListener, "scroll")).toBeDefined();
    });

    it("updates the props to set isScrollLoadEnabled to true again", () => {
      result.wrapper.setProps({
        isScrollLoadEnabled: true
      });
    });

    it("unbinds the scroll event listener", () => {
      expect(findMockCall(window.addEventListener, "scroll")).toBeDefined();
    });

    it("calls the onLoad prop", () => {
      expect(result.props.onLoad).toHaveBeenCalledTimes(1);
    });

    it("clears mocks", () => {
      jest.clearAllMocks();
    });

    it("unmounts component", () => {
      result.wrapper.unmount();
    });

    it("unbinds scroll event listener", () => {
      expect(findMockCall(window.removeEventListener, "scroll")).toBeDefined();
    });
  });

  describe("when mounting on the server and isScrollLoadEnabled is true", () => {
    let result: ReturnType<typeof component.mount>;

    beforeAll(() => {
      jest.clearAllMocks();

      Object.defineProperty(window, "isServer", {
        value: true,
        writable: true
      });

      result = component
        .withProps({
          isScrollLoadEnabled: true,
          triggerDistance: 200
        })
        .mount();
    });

    it("doesn't bind scroll event listener", () => {
      expect(findMockCall(window.addEventListener, "scroll")).toBeUndefined();
    });

    it("doesn't call the onLoad prop instantly", () => {
      expect(result.props.onLoad).toHaveBeenCalledTimes(0);
    });

    it("updates the props to set isScrollLoadEnabled to false", () => {
      result.wrapper.setProps({
        isScrollLoadEnabled: false
      });
    });

    it("doesn't unbind the scroll event listener", () => {
      expect(
        findMockCall(window.removeEventListener, "scroll")
      ).toBeUndefined();
    });

    it("updates the props to set isScrollLoadEnabled to true again", () => {
      result.wrapper.setProps({
        isScrollLoadEnabled: true
      });
    });

    it("doesn't unbind the scroll event listener", () => {
      expect(findMockCall(window.addEventListener, "scroll")).toBeUndefined();
    });
  });

  it("renders children within the button when they're defined", () => {
    const { wrapper } = component.withChildren("Load button").render();

    expect(wrapper.text()).toBe("Load button");
  });

  it("renders LOAD_MORE within the button when no children are defined and hasError is false", () => {
    const { wrapper } = component
      .withProps({
        hasError: false,
        isLoading: false
      })
      .render();

    expect(wrapper.text()).toBe(messages.LOAD_MORE);
  });

  it("renders TRY_AGAIN within the button when no children are defined and hasError is true", () => {
    const { wrapper } = component
      .withProps({
        hasError: true,
        isLoading: false
      })
      .render();

    expect(wrapper.text()).toBe(messages.TRY_AGAIN);
  });

  it("renders a Loader when isLoading is true", () => {
    const { wrapper } = component
      .withProps({
        isLoading: true
      })
      .mount();

    expect(wrapper.find("Loader")).toHaveLength(1);
  });
});
