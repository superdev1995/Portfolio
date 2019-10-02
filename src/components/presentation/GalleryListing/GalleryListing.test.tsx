import { gallery } from "../../../models/root.models";
import ComponentTester from "../../../utilities/ComponentTester";
import GalleryListing from "./GalleryListing";

const component = new ComponentTester(GalleryListing).withDefaultProps(
  gallery({
    description: "Description",
    modifiedAt: "2017-10-10T18:00:00",
    slug: "test-1",
    title: "Title"
  })
);

describe("[presentation] <GalleryListing />", () => {
  describe("when imageUrl is defined", () => {
    const { props, wrapper } = component
      .withProps({
        imageUrl: "Image URL",
        onLoad: jest.fn()
      })
      .mount();

    it("doesn't render with isRendered class instantly", () => {
      expect(wrapper.find(".isRendered")).toHaveLength(0);
    });

    it("doesn't call onLoad prop instantly", () => {
      expect(props.onLoad).toHaveBeenCalledTimes(0);
    });

    it("loads the image", () => {
      wrapper.find("Image").simulate("load");
    });

    it("adds isRendered class", () => {
      expect(wrapper.find(".isRendered")).toHaveLength(1);
    });

    it("calls onLoad prop", () => {
      expect(props.onLoad).toHaveBeenCalledTimes(1);
    });

    it("matches snapshot", () => {
      expect(wrapper.render()).toMatchSnapshot();
    });
  });

  describe("when imageUrl isn't defined", () => {
    const { wrapper } = component.withProps({ imageUrl: undefined }).mount();

    it("renders with isRendered class instantly", () => {
      expect(wrapper.find(".isRendered")).toHaveLength(1);
    });
  });
});
