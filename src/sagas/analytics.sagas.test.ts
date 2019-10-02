import * as actions from "../actions/root.actions";
import SagaTester from "../utilities/SagaTester";

describe("[sagas] Analytics", () => {
  describe("trackAnalyticsEventSaga", () => {
    describe("when tracking custom events", () => {
      const event = { event: "test.event", value: "test" };
      const dataLayer: any = [];

      dataLayer.push = jest.fn();
      const saga = new SagaTester({}, { dataLayer });

      it("dispatches actions.trackEvent", () => {
        saga.dispatch(actions.trackEvent(event));
      });

      it("pushes event payload to dataLayer", () => {
        expect(dataLayer.push).toBeCalled();
        expect(dataLayer.push.mock.calls[0][0]).toEqual(event);
      });
    });
  });
});
