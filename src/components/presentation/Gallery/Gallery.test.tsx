import { gallery, galleryImage } from "../../../models/root.models";
import ComponentTester from "../../../utilities/ComponentTester";
import Gallery from "./Gallery";

const component = new ComponentTester(Gallery).withDefaultProps(
  gallery({
    description: "Description",
    imageUrl: "Image URL",
    modifiedAt: "2017-10-10T18:00:00",
    slug: "test-1",
    title: "Title"
  })
);

const images = [
  galleryImage({ imageUrl: "Image 1" }),
  galleryImage({ imageUrl: "Image 2" }),
  galleryImage({ imageUrl: "Image 3" })
];

describe("[presentation] <Gallery />", () => {
  describe("when there are images defined", () => {
    const { props, wrapper } = component
      .withProps({
        images,
        onGalleryInteraction: jest.fn()
      })
      .mount();

    it("renders all images", () => {
      expect(wrapper.find("Image.Gallery--image")).toHaveLength(3);
    });

    it("clicks an image", () => {
      wrapper
        .find("Image.Gallery--image")
        .first()
        .simulate("click");
    });

    it("calls onGalleryInteraction prop", () => {
      expect(props.onGalleryInteraction).toHaveBeenCalledTimes(1);
    });

    it("matches snapshot", () => {
      expect(wrapper.render()).toMatchSnapshot();
    });
  });

  describe("when there are no images", () => {
    const { wrapper } = component
      .withProps({
        images: undefined
      })
      .render();

    it("doesn't render the images container", () => {
      expect(wrapper.find(".Gallery--images")).toHaveLength(0);
    });

    it("matches snapshot", () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe("when onGalleryInteraction isn't defined", () => {
    const { wrapper } = component
      .withProps({
        images
      })
      .mount();

    it("doesn't throw an error when clicking a gallery item", () => {
      expect(() => {
        wrapper
          .find("Image.Gallery--image")
          .first()
          .simulate("click");
      }).not.toThrowError();
    });
  });
});
