import { newsArticle } from "../../../models/root.models";
import ComponentTester from "../../../utilities/ComponentTester";
import NewsArticle from "./NewsArticle";

const component = new ComponentTester(NewsArticle).withDefaultProps(
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

describe("[presentation] <NewsArticle />", () => {
  describe("when no action is defined", () => {
    const { wrapper } = component.mount();

    it("doesn't render the action", () => {
      expect(wrapper.find(".NewsArticle--action Link")).toHaveLength(0);
    });

    it("matches snapshot", () => {
      expect(wrapper.render()).toMatchSnapshot();
    });
  });

  describe("when the action is defined, with a route", () => {
    const { wrapper } = component
      .withProps({
        action: {
          route: "/",
          text: "Action"
        }
      })
      .mount();

    it("renders the action", () => {
      expect(
        wrapper.find(".NewsArticle--action Link[route='/'][prefetch=true]")
      ).toHaveLength(1);
    });

    it("matches snapshot", () => {
      expect(wrapper.render()).toMatchSnapshot();
    });
  });

  describe("when the action is defined, with a url", () => {
    const { wrapper } = component
      .withProps({
        action: {
          text: "Action",
          url: "/"
        }
      })
      .mount();

    it("renders the action", () => {
      expect(
        wrapper.find(".NewsArticle--action Link[href='/'][isExternal=true]")
      ).toHaveLength(1);
    });

    it("matches snapshot", () => {
      expect(wrapper.render()).toMatchSnapshot();
    });
  });

  describe("when loading the image", () => {
    const { wrapper } = component.mount();

    it("doesn't add the isRendered class initially", () => {
      expect(wrapper.find(".isRendered")).toHaveLength(0);
    });

    it("loads the image", () => {
      wrapper.find("Image.NewsArticle--image").simulate("load");
    });

    it("adds the isRendered class", () => {
      expect(wrapper.find(".isRendered")).toHaveLength(1);
    });
  });
});
