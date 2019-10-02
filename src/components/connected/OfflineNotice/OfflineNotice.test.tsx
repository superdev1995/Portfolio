import ComponentTester from "../../../utilities/ComponentTester";
import OfflineNotice from "./OfflineNotice";

const component = new ComponentTester(OfflineNotice, true);

describe("[connected] <OfflineNotice />", () => {
  it("renders correctly when offline", () => {
    const { wrapper } = component
      .withReduxState({
        app: {
          isOnline: false
        }
      })
      .mount();

    expect(wrapper.find(".OfflineNotice")).toHaveLength(1);
    expect(wrapper.render()).toMatchSnapshot();
  });

  it("renders nothing when online", () => {
    const { wrapper } = component
      .withReduxState({
        app: {
          isOnline: true
        }
      })
      .mount();

    expect(wrapper.find(".OfflineNotice")).toHaveLength(0);
  });
});
