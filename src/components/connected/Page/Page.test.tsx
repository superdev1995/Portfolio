import ComponentTester from "../../../utilities/ComponentTester";

import Page from "./Page";

const component = new ComponentTester(Page, true)
  .withDefaultProps({
    className: "TestClassName"
  })
  .withDefaultReduxState({
    app: { isLoading: false }
  })
  .withDefaultChildren("Page");

describe("[connected] <Page />", () => {
  describe("when the app isn't loading", () => {
    const { wrapper } = component.mount();
    const rendered = wrapper.render();

    it("doesn't render with isLoading class", () => {
      expect(rendered.hasClass("isLoading")).toBe(false);
    });

    it("renders children instead of loader", () => {
      expect(rendered.find(".Page--body").html()).toBe("Page");
    });
  });

  describe("when the app is loading", () => {
    const { wrapper } = component
      .withReduxState({
        app: { isLoading: true }
      })
      .mount();
    const rendered = wrapper.render();

    it("renders with isLoading class", () => {
      expect(rendered.hasClass("isLoading")).toBe(true);
    });

    it("renders loader instead of children", () => {
      expect(rendered.find(".Loader")).toHaveLength(1);
    });
  });
});
