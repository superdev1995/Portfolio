import * as React from "react";

import ComponentTester from "../../../utilities/ComponentTester";
import { filterMockCalls } from "../../../utilities/mocks";
import Modal from "./Modal";

const component = new ComponentTester(Modal)
  .withDefaultProps({
    className: "TestModal",
    hasFocusRestriction: true,
    isOpen: true,
    onClose: jest.fn(),
    usePortal: false
  })
  .withDefaultChildren(
    <div className="Modal--testContent">
      <input id="Modal--input" />
    </div>
  );

describe("[presentation] <Modal />", () => {
  jest.spyOn(window, "addEventListener");
  jest.spyOn(window, "removeEventListener");

  it("doesn't render anything when isOpen is false", () => {
    const { wrapper } = component.withProps({ isOpen: false }).mount();

    expect(wrapper.render().html()).toBeNull();
  });

  describe("when toggling the isOpen prop", () => {
    let result: ReturnType<typeof component.mount>;

    beforeAll(() => {
      jest.clearAllMocks();
    });

    afterAll(() => {
      result.wrapper.unmount();
    });

    it("mounts the component", () => {
      result = component.mount();
    });

    it("renders the modal", () => {
      expect(result.wrapper.find(".Modal")).toHaveLength(1);
    });

    it("matches snapshot when open", () => {
      expect(result.wrapper.render()).toMatchSnapshot();
    });

    it("renders the children in the body element", () => {
      expect(
        result.wrapper.find(".Modal--body .Modal--testContent")
      ).toHaveLength(1);
    });

    it("sets the isOpen prop to false", () => {
      result.wrapper.setProps({ isOpen: false });
    });

    it("doesn't render anything", () => {
      expect(result.wrapper.render().html()).toBeNull();
    });

    it("sets the isOpen prop to true again", () => {
      result.wrapper.setProps({ isOpen: true });
    });

    it("renders the modal", () => {
      expect(result.wrapper.find(".Modal")).toHaveLength(1);
    });

    it("sets the isOpen prop to false", () => {
      result.wrapper.setProps({ isOpen: false });
    });
  });

  describe("when interacting with the close button", () => {
    let result: ReturnType<typeof component.mount>;

    beforeAll(() => {
      jest.clearAllMocks();
    });

    afterAll(() => {
      result.wrapper.unmount();
    });

    it("mounts the component", () => {
      result = component.mount();
    });

    it("clicks the close button", () => {
      result.wrapper.find("Button.Modal--closeButton").simulate("click");
    });

    it("calls the onClose prop", () => {
      expect(result.props.onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe("when interacting with the overlay", () => {
    let result: ReturnType<typeof component.mount>;

    beforeAll(() => {
      jest.clearAllMocks();
    });

    afterAll(() => {
      result.wrapper.unmount();
    });

    it("mounts the component", () => {
      result = component.mount();
    });

    it("clicks the overlay", () => {
      result.wrapper.find(".Modal--overlay").simulate("click");
    });

    it("calls the onClose prop", () => {
      expect(result.props.onClose).toHaveBeenCalledTimes(1);
    });

    it("sets the hasOverlayClick prop to false", () => {
      result.wrapper.setProps({ hasOverlayClick: false });
    });

    it("clicks the overlay", () => {
      result.wrapper.find(".Modal--overlay").simulate("click");
    });

    it("doesn't call the onClose prop", () => {
      expect(result.props.onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe("when interacting with the keyboard", () => {
    let result: ReturnType<typeof component.mount>;

    beforeAll(() => {
      jest.clearAllMocks();
    });

    it("mounts the component", () => {
      result = component
        .withProps({
          onKeyDown: jest.fn()
        })
        .mount();
    });

    it("binds keydown event handler", () => {
      expect(filterMockCalls(window.addEventListener, "keydown")).toHaveLength(
        1
      );
    });

    it("presses the Escape key", () => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    });

    it("calls the onClose prop", () => {
      expect(result.props.onClose).toHaveBeenCalledTimes(1);
    });

    it("calls the onKeyDown prop", () => {
      expect(result.props.onKeyDown).toHaveBeenCalledTimes(1);
    });

    it("presses a key other than Escape", () => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft" }));
    });

    it("doesn't call the onClose prop", () => {
      expect(result.props.onClose).toHaveBeenCalledTimes(1);
    });

    it("calls the onKeyDown prop", () => {
      expect(result.props.onKeyDown).toHaveBeenCalledTimes(2);
    });

    it("sets the onKeyDown prop to be undefined", () => {
      result.wrapper.setProps({ onKeyDown: undefined });
    });

    it("presses the Escape key", () => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    });

    it("calls the onClose prop", () => {
      expect(result.props.onClose).toHaveBeenCalledTimes(2);
    });

    it("sets the isOpen prop to false", () => {
      result.wrapper.setProps({ isOpen: false });
    });

    it("unbinds keydown event handler", () => {
      expect(
        filterMockCalls(window.removeEventListener, "keydown")
      ).toHaveLength(1);
    });

    it("sets the isOpen prop to true", () => {
      result.wrapper.setProps({ isOpen: true });
    });

    it("binds keydown event handler", () => {
      expect(filterMockCalls(window.addEventListener, "keydown")).toHaveLength(
        2
      );
    });

    it("unmounts component", () => {
      result.wrapper.unmount();
    });

    it("unbinds keydown event handler", () => {
      expect(
        filterMockCalls(window.removeEventListener, "keydown")
      ).toHaveLength(2);
    });
  });

  describe("Focus management", () => {
    describe("when binding the focus event handler", () => {
      let result: ReturnType<typeof component.mount>;

      beforeAll(() => {
        jest.clearAllMocks();
      });

      afterAll(() => {
        result.wrapper.unmount();
      });

      it("mounts the component", () => {
        result = component
          .withProps({
            hasFocusRestriction: true
          })
          .mount();
      });

      it("binds focus event handler", () => {
        expect(filterMockCalls(window.addEventListener, "focus")).toHaveLength(
          1
        );
      });

      it("sets the isOpen prop to false", () => {
        result.wrapper.setProps({ isOpen: false });
      });

      it("unbinds focus event handler", () => {
        expect(
          filterMockCalls(window.removeEventListener, "focus")
        ).toHaveLength(1);
      });

      it("sets the isOpen prop to true", () => {
        result.wrapper.setProps({ isOpen: true });
      });

      it("binds focus event handler", () => {
        expect(filterMockCalls(window.addEventListener, "focus")).toHaveLength(
          2
        );
      });

      it("sets the hasFocusRestriction prop to false", () => {
        result.wrapper.setProps({ hasFocusRestriction: false });
      });

      it("unbinds focus event handler", () => {
        expect(
          filterMockCalls(window.removeEventListener, "focus")
        ).toHaveLength(2);
      });

      it("sets the isOpen prop to false", () => {
        result.wrapper.setProps({ isOpen: false });
      });

      it("doesn't unbind the focus event handler", () => {
        expect(
          filterMockCalls(window.removeEventListener, "focus")
        ).toHaveLength(2);
      });

      it("sets the isOpen prop to true", () => {
        result.wrapper.setProps({ isOpen: true });
      });

      it("doesn't bind the focus event handler", () => {
        expect(
          filterMockCalls(window.removeEventListener, "focus")
        ).toHaveLength(2);
      });

      it("sets the hasFocusRestriction prop to true", () => {
        result.wrapper.setProps({ hasFocusRestriction: true });
      });

      it("binds focus event handler", () => {
        expect(filterMockCalls(window.addEventListener, "focus")).toHaveLength(
          3
        );
      });
    });

    describe("when dispatching focus events", () => {
      const stopPropagationMock = jest.fn();

      const bodyEvent = new FocusEvent("focus");
      Object.defineProperties(bodyEvent, {
        stopPropagation: { value: stopPropagationMock },
        target: { value: document.body }
      });

      const inputNode = document.createElement("input");
      document.body.appendChild(inputNode);

      const outsideInputEvent = new FocusEvent("focus");
      Object.defineProperties(outsideInputEvent, {
        stopPropagation: { value: stopPropagationMock },
        target: { value: inputNode }
      });

      describe("when usePortal is false", () => {
        let result: ReturnType<typeof component.mount>;

        beforeAll(() => {
          jest.clearAllMocks();
        });

        afterAll(() => {
          result.wrapper.unmount();
        });

        it("mounts the component", () => {
          result = component.mount();
        });

        it("dispatches a focus event from the body element", () => {
          window.dispatchEvent(bodyEvent);
        });

        it("prevents the focus event from proceeding", () => {
          expect(stopPropagationMock).toHaveBeenCalledTimes(1);
        });

        it("dispatches a focus event from an input element outside the modal", () => {
          window.dispatchEvent(outsideInputEvent);
        });

        it("prevents the focus event from proceeding", () => {
          expect(stopPropagationMock).toHaveBeenCalledTimes(2);
        });

        it("dispatches a focus event from an input element within the modal", () => {
          const modalInput = result.wrapper.find("#Modal--input").instance();
          const event = new FocusEvent("focus");
          Object.defineProperties(event, {
            stopPropagation: { value: stopPropagationMock },
            target: { value: modalInput }
          });
          window.dispatchEvent(event);
        });

        it("doesn't prevent the focus event from proceeding", () => {
          expect(stopPropagationMock).toHaveBeenCalledTimes(2);
        });

        it("clears stopPropagationMock", () => {
          stopPropagationMock.mockClear();
        });
      });

      describe("when usePortal is true", () => {
        let result: ReturnType<typeof component.mount>;

        beforeAll(() => {
          jest.clearAllMocks();
        });

        afterAll(() => {
          result.wrapper.unmount();
        });

        it("mounts the component", () => {
          result = component
            .withProps({
              usePortal: true
            })
            .mount();
        });

        it("dispatches a focus event from the body element", () => {
          window.dispatchEvent(bodyEvent);
        });

        it("prevents the focus event from proceeding", () => {
          expect(stopPropagationMock).toHaveBeenCalledTimes(1);
        });

        it("dispatches a focus event from an input element outside the modal", () => {
          window.dispatchEvent(outsideInputEvent);
        });

        it("prevents the focus event from proceeding", () => {
          expect(stopPropagationMock).toHaveBeenCalledTimes(2);
        });

        it("dispatches a focus event from an input element within the modal", () => {
          const modalInput = result.wrapper.find("#Modal--input").instance();
          const event = new FocusEvent("focus");
          Object.defineProperties(event, {
            stopPropagation: { value: stopPropagationMock },
            target: { value: modalInput }
          });
          window.dispatchEvent(event);
        });

        it("doesn't prevent the focus event from proceeding", () => {
          expect(stopPropagationMock).toHaveBeenCalledTimes(2);
        });

        it("clears stopPropagationMock", () => {
          stopPropagationMock.mockClear();
        });
      });
    });
  });
});
