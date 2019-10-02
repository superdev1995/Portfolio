import ComponentTester from "../../../utilities/ComponentTester";

import NewVersionToast from "./NewVersionToast";

const component = new ComponentTester(NewVersionToast, true);

describe("[connected] <NewVersionToast />", () => {
  describe("when there's no new version available", () => {
    const { wrapper } = component
      .withReduxState({
        app: {
          hasNewVersion: false
        }
      })
      .mount();

    it("doesn't render the toast", () => {
      expect(wrapper.render().html()).toBeNull();
    });
  });

  describe("when there's a new version available", () => {
    const { wrapper } = component
      .withReduxState({
        app: {
          hasNewVersion: true
        }
      })
      .mount();

    it("renders the toast", () => {
      expect(wrapper.find(".Toast")).toHaveLength(1);
    });

    describe("when clicking the refresh button", () => {
      Object.defineProperty(window.location, "reload", {
        value: jest.fn()
      });

      it("clicks the button", () => {
        wrapper.find("Button.NewVersionToast--refreshButton").simulate("click");
      });

      it("triggers a hard refresh", () => {
        expect(window.location.reload).toHaveBeenCalledWith(true);
      });
    });
  });
});
