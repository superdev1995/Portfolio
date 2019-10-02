import * as actions from "../../../actions/root.actions";
import * as messages from "../../../locales/en-NZ";
import ComponentTester from "../../../utilities/ComponentTester";
import OnlineStatusToast from "./OnlineStatusToast";

const component = new ComponentTester(OnlineStatusToast, true);

describe("[connected] <OnlineStatusToast />", () => {
  jest.useFakeTimers();

  describe("when initially offline", () => {
    const { wrapper, dispatch } = component
      .withReduxState({
        app: {
          isOnline: false
        }
      })
      .mount();

    it("renders the toast", () => {
      expect(wrapper.find(".Toast")).toHaveLength(1);
    });

    it("renders with YOU_ARE_OFFLINE", () => {
      expect(wrapper.render().text()).toBe(messages.YOU_ARE_OFFLINE);
    });

    it("dispatches actions.setOnlineStatus(true)", () => {
      dispatch(actions.setOnlineStatus(true));
    });

    it("renders with YOU_ARE_BACK_ONLINE", () => {
      expect(wrapper.render().text()).toBe(messages.YOU_ARE_BACK_ONLINE);
    });

    it("waits for the toast to auto-dismiss", () => {
      jest.runTimersToTime(500);
    });

    it("dispatches actions.setOnlineStatus(true) again", () => {
      dispatch(actions.setOnlineStatus(true));
    });

    it("doesn't re-render the toast", () => {
      expect(wrapper.render().find(".Toast")).toHaveLength(0);
    });
  });

  describe("when initially online", () => {
    const { wrapper } = component
      .withReduxState({
        app: {
          isOnline: true
        }
      })
      .mount();

    it("doesn't render anything", () => {
      expect(wrapper.find(".Toast")).toHaveLength(0);
    });
  });
});
