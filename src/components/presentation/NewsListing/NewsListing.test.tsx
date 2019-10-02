import { newsArticle } from "../../../models/root.models";
import ComponentTester from "../../../utilities/ComponentTester";
import NewsListing from "./NewsListing";

const component = new ComponentTester(NewsListing).withDefaultProps(
  newsArticle({
    author: "Author",
    content: "<p>Content</p>",
    createdAt: "2017-10-10T18:00:00",
    excerpt: "Excerpt",
    imageUrl: "Image URL",
    slug: "article-1",
    title: "Title"
  })
);

describe("[presentation] <NewsListing />", () => {
  describe("when isCondensed is false", () => {
    const { wrapper } = component
      .withProps({
        isCondensed: false
      })
      .render();

    it("renders with an <h2>", () => {
      expect(wrapper.find("h2")).toHaveLength(1);
    });

    it("matches snapshot", () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe("when isCondensed is true", () => {
    const { wrapper } = component
      .withProps({
        isCondensed: true
      })
      .render();

    it("renders with an <h3>", () => {
      expect(wrapper.find("h3")).toHaveLength(1);
    });

    it("matches snapshot", () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe("when loading the image", () => {
    const { props, wrapper } = component
      .withProps({
        onLoad: jest.fn()
      })
      .mount();

    it("doesn't add the isRendered class initially", () => {
      expect(wrapper.find(".isRendered")).toHaveLength(0);
    });

    it("loads the image", () => {
      wrapper.find("Image.NewsListing--image").simulate("load");
    });

    it("adds the isRendered class", () => {
      expect(wrapper.find(".isRendered")).toHaveLength(1);
    });

    it("calls the onLoad prop", () => {
      expect(props.onLoad).toHaveBeenCalledTimes(1);
    });

    it("sets the onLoad prop to be undefined", () => {
      wrapper.setProps({ onLoad: undefined });
    });

    it("loads the image", () => {
      wrapper.find("Image.NewsListing--image").simulate("load");
    });
  });
});
