import { dynamoResponse, resource } from "../models/root.models";
import { mockWithFailure, mockWithSuccess } from "../utilities/mocks";
import SagaTester from "../utilities/SagaTester";

import * as actions from "../actions/root.actions";

describe("[sagas] Resources", () => {
  const item = resource({ slug: "item-1" });
  const data = dynamoResponse({
    items: [item]
  });

  describe("fetchResourcesSaga", () => {
    describe("when fetching resources, with a successful response", () => {
      const saga = new SagaTester(
        {},
        {
          api: {
            fetchResources: mockWithSuccess(data)
          }
        }
      );

      it("dispatches actions.fetchResources.started", () => {
        saga.dispatch(actions.fetchResources.started({}));
      });

      it("makes a single API request", () => {
        expect(saga.ports.api.fetchResources).toHaveBeenCalledTimes(1);
      });

      it("dispatches actions.fetchResources.done with the expected result", () => {
        const matchingActions = saga.history.filter(
          actions.fetchResources.done.match
        );

        expect(matchingActions).toHaveLength(1);
        expect(matchingActions[0].payload.result).toEqual(data);
      });
    });

    describe("when fetching resources, with a failed response", () => {
      const saga = new SagaTester(
        {},
        {
          api: {
            fetchResources: mockWithFailure("Bad request")
          }
        }
      );

      it("dispatches actions.fetchResources.started", () => {
        saga.dispatch(actions.fetchResources.started({}));
      });

      it("makes a single API request", () => {
        expect(saga.ports.api.fetchResources).toHaveBeenCalledTimes(1);
      });

      it("dispatches actions.fetchResources.failed with expected error", () => {
        const matchingActions = saga.history.filter(
          actions.fetchResources.failed.match
        );

        expect(matchingActions).toHaveLength(1);
        expect(matchingActions[0].payload.error).toBe("Bad request");
      });
    });
  });

  describe("fetchMoreResourcesSaga", () => {
    describe("when fetching more resources, with a successful response", () => {
      const saga = new SagaTester(
        {
          resources: {
            items: {
              "existing-item": {
                ...item,
                slug: "existing-item"
              }
            },
            lastEvaluatedKey: {
              createdAt: "2019-01-01T00:00:00",
              isActive: "y",
              slug: "existing-item"
            }
          }
        },
        {
          api: {
            fetchResources: mockWithSuccess(data)
          }
        }
      );

      it("dispatches actions.fetchMoreResources.started", () => {
        saga.dispatch(actions.fetchMoreResources.started({}));
      });

      it("makes a single API request", () => {
        expect(saga.ports.api.fetchResources).toHaveBeenCalledTimes(1);
      });

      it("dispatches actions.fetchMoreResources.done with expected result", () => {
        const matchingActions = saga.history.filter(
          actions.fetchMoreResources.done.match
        );

        expect(matchingActions).toHaveLength(1);
        expect(matchingActions[0].payload.result).toEqual(data);
      });

      it("dispatches actions.trackEvent with expected payload", () => {
        const matchingActions = saga.history.filter(actions.trackEvent.match);

        expect(matchingActions).toHaveLength(1);
        expect(matchingActions[0].payload).toEqual({
          event: "resources.fetchedMore",
          itemCount: 2
        });
      });
    });

    describe("when fetching more resources, with a failed response", () => {
      const saga = new SagaTester(
        {},
        {
          api: {
            fetchResources: mockWithFailure("Bad request")
          }
        }
      );

      it("dispatches actions.fetchMoreResources.started", () => {
        saga.dispatch(actions.fetchMoreResources.started({}));
      });

      it("makes a single API request", () => {
        expect(saga.ports.api.fetchResources).toHaveBeenCalledTimes(1);
      });

      it("dispatches actions.fetchMoreResources.failed with expected error", () => {
        const matchingActions = saga.history.filter(
          actions.fetchMoreResources.failed.match
        );

        expect(matchingActions).toHaveLength(1);
        expect(matchingActions[0].payload.error).toBe("Bad request");
      });
    });
  });
});
