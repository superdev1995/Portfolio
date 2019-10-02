import * as messages from "../../../locales/en-NZ";
import ComponentTester from "../../../utilities/ComponentTester";
import ErrorPage from "./ErrorPage";

const component = new ComponentTester(ErrorPage);

describe("[presentation] <ErrorPage />", () => {
  describe("when status is 404", () => {
    const { wrapper } = component
      .withProps({
        status: 404
      })
      .render();

    it("renders the correct title", () => {
      expect(wrapper.find(".PageHeader").text()).toBe(messages.ERROR_404_TITLE);
    });

    it("renders the correct message", () => {
      expect(wrapper.find(".ErrorPage--content").text()).toBe(
        messages.ERROR_404_MESSAGE
      );
    });

    it("matches snapshot", () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe("when status is 500", () => {
    const { wrapper } = component
      .withProps({
        status: 500
      })
      .render();

    it("renders the correct title", () => {
      expect(wrapper.find(".PageHeader").text()).toBe(messages.ERROR_TITLE);
    });

    it("renders the correct message", () => {
      expect(wrapper.find(".ErrorPage--content").text()).toBe(
        messages.ERROR_MESSAGE
      );
    });

    it("matches snapshot", () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe("when message is defined", () => {
    const message = "Test message";

    const { wrapper } = component
      .withProps({
        message
      })
      .render();

    it("renders the correct message", () => {
      expect(wrapper.find(".ErrorPage--content").text()).toBe(message);
    });

    it("matches snapshot", () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
