import * as actions from "../actions/root.actions";
import SagaTester from "../utilities/SagaTester";

describe("[sagas] Service worker", () => {
  describe("cachePageOnTransitionSaga", () => {
    describe("when the service worker is available", () => {
      afterAll(() => {
        jest.clearAllMocks();
      });

      const newRoute = "/test";
      const saga = new SagaTester();

      it("has a service worker in an 'activated' state", () => {
        const { state } = navigator.serviceWorker.controller as ServiceWorker;

        expect(navigator.serviceWorker).toBeDefined();
        expect(state).toBe("activated");
      });

      it("dispatches actions.changeRoute.done", () => {
        saga.dispatch(
          actions.changeRoute.done({ params: newRoute, result: {} })
        );
      });

      it("calls serviceWorker.postMessage with expected payload", () => {
        const { postMessage } = navigator.serviceWorker
          .controller as ServiceWorker;

        expect(postMessage).toHaveBeenCalledWith({
          payload: newRoute,
          type: "changeRoute"
        });
      });
    });

    describe("when the service worker isn't ready", () => {
      beforeAll(() => {
        // @ts-ignore-next-line
        navigator.serviceWorker.controller.state = "installing";
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      const newRoute = "/test";

      const saga = new SagaTester();
      let isPassing = true;

      it("has a service worker in an 'installing' state", () => {
        const { state } = navigator.serviceWorker.controller as ServiceWorker;

        expect(navigator.serviceWorker).toBeDefined();
        expect(state).toBe("installing");
      });

      it("dispatches actions.changeRoute.done", () => {
        try {
          saga.dispatch(
            actions.changeRoute.done({ params: newRoute, result: {} })
          );
        } catch (error) {
          isPassing = false;
        }
      });

      it("doesn't throw an error", () => {
        expect(isPassing).toBe(true);
      });

      it("doesn't call serviceWorker.postMessage", () => {
        const { postMessage } = navigator.serviceWorker
          .controller as ServiceWorker;

        expect(postMessage).not.toHaveBeenCalled();
      });
    });

    describe("when the service worker doesn't exist", () => {
      beforeAll(() => {
        // @ts-ignore-next-line
        navigator.serviceWorker = undefined;
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      const saga = new SagaTester();
      let isPassing = true;

      it("dispatches actions.changeRoute.done", () => {
        try {
          saga.dispatch(
            actions.changeRoute.done({ params: "/test", result: {} })
          );
        } catch (error) {
          isPassing = false;
        }
      });

      it("has no service worker available", () => {
        expect(navigator.serviceWorker).toBeUndefined();
      });

      it("fails silently without throwing an error", () => {
        expect(isPassing).toBe(true);
      });
    });
  });

  describe("receiveServiceWorkerMessageSaga", () => {
    describe("when receiving a serviceworker.activate message", () => {
      const saga = new SagaTester();

      it("dispatches actions.receiveServiceWorkerMessage", () => {
        saga.dispatch(
          actions.receiveServiceWorkerMessage({
            type: "serviceWorker.activate"
          })
        );
      });

      it("dispatches actions.setHasNewVersion with the expected payload", () => {
        const matchingActions = saga.history.filter(
          actions.setHasNewVersion.match
        );

        expect(matchingActions).toHaveLength(1);
        expect(matchingActions[0].payload).toBe(true);
      });
    });
  });
});
