import { dynamoResponse, stem } from "../models/root.models";
import { mockWithFailure, mockWithSuccess } from "../utilities/mocks";
import SagaTester from "../utilities/SagaTester";

import * as actions from "../actions/root.actions";

describe("[sagas] Stems", () => {
  const item = stem({ slug: "item-1" });
  const data = dynamoResponse({
    items: [item]
  });

  describe("fetchStemsSaga", () => {
    describe("when fetching stems, with a successful response", () => {
      const saga = new SagaTester(
        {},
        {
          api: {
            fetchStems: mockWithSuccess(data)
          }
        }
      );

      it("dispatches actions.fetchStems.started", () => {
        saga.dispatch(actions.fetchStems.started({}));
      });

      it("makes a single API request", () => {
        expect(saga.ports.api.fetchStems).toHaveBeenCalledTimes(1);
      });

      it("dispatches actions.fetchStems.done with the expected result", () => {
        const matchingActions = saga.history.filter(
          actions.fetchStems.done.match
        );

        expect(matchingActions).toHaveLength(1);
        expect(matchingActions[0].payload.result).toEqual(data);
      });
    });

    describe("when fetching stems, with a failed response", () => {
      const saga = new SagaTester(
        {},
        {
          api: {
            fetchStems: mockWithFailure("Bad request")
          }
        }
      );

      it("dispatches actions.fetchStems.started", () => {
        saga.dispatch(actions.fetchStems.started({}));
      });

      it("makes a single API request", () => {
        expect(saga.ports.api.fetchStems).toHaveBeenCalledTimes(1);
      });

      it("dispatches actions.fetchStems.failed with expected error", () => {
        const matchingActions = saga.history.filter(
          actions.fetchStems.failed.match
        );

        expect(matchingActions).toHaveLength(1);
        expect(matchingActions[0].payload.error).toBe("Bad request");
      });
    });
  });

  describe("fetchMoreStemsSaga", () => {
    describe("when fetching more stems, with a successful response", () => {
      const saga = new SagaTester(
        {
          stems: {
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
            fetchStems: mockWithSuccess(data)
          }
        }
      );

      it("dispatches actions.fetchMoreStems.started", () => {
        saga.dispatch(actions.fetchMoreStems.started({}));
      });

      it("makes a single API request", () => {
        expect(saga.ports.api.fetchStems).toHaveBeenCalledTimes(1);
      });

      it("dispatches actions.fetchMoreStems.done with expected result", () => {
        const matchingActions = saga.history.filter(
          actions.fetchMoreStems.done.match
        );

        expect(matchingActions).toHaveLength(1);
        expect(matchingActions[0].payload.result).toEqual(data);
      });

      it("dispatches actions.trackEvent with expected payload", () => {
        const matchingActions = saga.history.filter(actions.trackEvent.match);

        expect(matchingActions).toHaveLength(1);
        expect(matchingActions[0].payload).toEqual({
          event: "stems.fetchedMore",
          itemCount: 2
        });
      });
    });

    describe("when fetching more stems, with a failed response", () => {
      const saga = new SagaTester(
        {},
        {
          api: {
            fetchStems: mockWithFailure("Bad request")
          }
        }
      );

      it("dispatches actions.fetchMoreStems.started", () => {
        saga.dispatch(actions.fetchMoreStems.started({}));
      });

      it("makes a single API request", () => {
        expect(saga.ports.api.fetchStems).toHaveBeenCalledTimes(1);
      });

      it("dispatches actions.fetchMoreStems.failed with expected error", () => {
        const matchingActions = saga.history.filter(
          actions.fetchMoreStems.failed.match
        );

        expect(matchingActions).toHaveLength(1);
        expect(matchingActions[0].payload.error).toBe("Bad request");
      });
    });
  });
});
