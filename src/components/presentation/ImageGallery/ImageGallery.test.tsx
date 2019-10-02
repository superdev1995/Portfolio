import * as React from "react";

import ComponentTester from "../../../utilities/ComponentTester";
import ImageGallery from "./ImageGallery";

const component = new ComponentTester(ImageGallery)
  .withDefaultProps({
    className: "TestImageGallery",
    usePortal: false
  })
  .withDefaultChildren([
    <div key="image-1" className="Image" id="image-1" />,
    <div key="image-2" className="Image" id="image-2" />,
    <div key="image-3" className="Image" id="image-3" />
  ]);

describe("[presentation] <ImageGallery />", () => {
  describe("when all props are defined and isLooped is true", () => {
    const { props, wrapper } = component
      .withProps({
        isLooped: true,
        onGoTo: jest.fn(),
        onItemClick: jest.fn(),
        onModalClose: jest.fn(),
        onNext: jest.fn(),
        onPrevious: jest.fn()
      })
      .mount();

    it("matches snapshot when the modal is closed", () => {
      expect(wrapper.render()).toMatchSnapshot();
    });

    it("renders all images", () => {
      expect(wrapper.find(".Image")).toHaveLength(3);
    });

    it("clicks an image", () => {
      wrapper
        .find(".Image")
        .first()
        .simulate("click");
    });

    it("calls the onItemClick prop with expected payload", () => {
      expect(props.onItemClick).toHaveBeenCalledTimes(1);
      expect(props.onItemClick).toHaveBeenCalledWith(0);
    });

    it("opens the modal", () => {
      expect(wrapper.find("Modal").prop("isOpen")).toBe(true);
    });

    it("renders the selected image in the modal", () => {
      expect(wrapper.find(".ImageGallery--modal--item #image-1")).toHaveLength(
        1
      );
    });

    it("matches snapshot when the modal is open", () => {
      expect(wrapper.render()).toMatchSnapshot();
    });

    it("clicks the next button", () => {
      wrapper.find("Button.ImageGallery--modal--nextButton").simulate("click");
    });

    it("renders the next image in the modal", () => {
      expect(wrapper.find(".ImageGallery--modal--item #image-2")).toHaveLength(
        1
      );
    });

    it("calls the onNext prop with expected payload", () => {
      expect(props.onNext).toHaveBeenCalledTimes(1);
      expect(props.onNext).toHaveBeenCalledWith(1);
    });

    it("clicks the previous button", () => {
      wrapper
        .find("Button.ImageGallery--modal--previousButton")
        .simulate("click");
    });

    it("renders the previous image in the modal", () => {
      expect(wrapper.find(".ImageGallery--modal--item #image-1")).toHaveLength(
        1
      );
    });

    it("calls the onPrevious prop with expected payload", () => {
      expect(props.onPrevious).toHaveBeenCalledTimes(1);
      expect(props.onPrevious).toHaveBeenCalledWith(0);
    });

    it("clears mocks", () => {
      jest.clearAllMocks();
    });

    it("presses the ArrowLeft key", () => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft" }));
      wrapper.update();
    });

    it("renders the last image in the modal", () => {
      expect(wrapper.find(".ImageGallery--modal--item #image-3")).toHaveLength(
        1
      );
    });

    it("calls onPrevious prop with expected payload", () => {
      expect(props.onPrevious).toHaveBeenCalledTimes(1);
      expect(props.onPrevious).toHaveBeenCalledWith(2);
    });

    it("presses the ArrowRight key", () => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));
      wrapper.update();
    });

    it("renders the first image in the modal", () => {
      expect(wrapper.find(".ImageGallery--modal--item #image-1")).toHaveLength(
        1
      );
    });

    it("calls onNext prop with expected payload", () => {
      expect(props.onNext).toHaveBeenCalledTimes(1);
      expect(props.onNext).toHaveBeenCalledWith(0);
    });

    it("clears mocks", () => {
      jest.clearAllMocks();
    });

    it("calls the public goTo method with an invalid index", () => {
      // @ts-ignore-next-line
      wrapper.instance().goTo(5);
    });

    it("doesn't change the current item", () => {
      expect(wrapper.find(".ImageGallery--modal--item #image-1")).toHaveLength(
        1
      );
    });

    it("doesn't call the onGoTo prop", () => {
      expect(props.onGoTo).toHaveBeenCalledTimes(0);
    });

    it("closes the modal", () => {
      wrapper.find("Button.Modal--closeButton").simulate("click");
    });

    it("calls the onModalClose prop", () => {
      expect(props.onModalClose).toHaveBeenCalledTimes(1);
    });
  });

  describe("when no event props are defined and isLooped is false", () => {
    const { wrapper } = component
      .withProps({
        isLooped: false
      })
      .mount();

    it("clicks the first image", () => {
      wrapper
        .find(".Image")
        .first()
        .simulate("click");
    });

    it("opens the modal", () => {
      expect(wrapper.find("Modal").prop("isOpen")).toBe(true);
    });

    it("renders the first image in the modal", () => {
      expect(wrapper.find(".ImageGallery--modal--item #image-1")).toHaveLength(
        1
      );
    });

    it("clicks the previous button", () => {
      wrapper
        .find("Button.ImageGallery--modal--previousButton")
        .simulate("click");
    });

    it("still has the first image rendered in the modal", () => {
      expect(wrapper.find(".ImageGallery--modal--item #image-1")).toHaveLength(
        1
      );
    });

    it("clicks the next button twice to navigate to the last item", () => {
      wrapper
        .find("Button.ImageGallery--modal--nextButton")
        .simulate("click")
        .simulate("click");
    });

    it("renders the last image in the modal", () => {
      expect(wrapper.find(".ImageGallery--modal--item #image-3")).toHaveLength(
        1
      );
    });

    it("clicks the next button", () => {
      wrapper.find("Button.ImageGallery--modal--nextButton").simulate("click");
    });

    it("still has the last image rendered in the modal", () => {
      expect(wrapper.find(".ImageGallery--modal--item #image-3")).toHaveLength(
        1
      );
    });

    it("closes the modal", () => {
      wrapper.find("Button.Modal--closeButton").simulate("click");
    });
  });
});
