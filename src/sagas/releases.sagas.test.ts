import { dynamoResponse, release } from "../models/root.models";
import { mockWithFailure, mockWithSuccess } from "../utilities/mocks";
import SagaTester from "../utilities/SagaTester";

import * as actions from "../actions/root.actions";

describe("[sagas] Releases", () => {
  const item = release({ slug: "item-1" });
  const data = dynamoResponse({
    items: [item]
  });

  describe("fetchReleasesSaga", () => {
    describe("when fetching releases, with a successful response", () => {
      const saga = new SagaTester(
        {},
        {
          api: {
            fetchReleases: mockWithSuccess(data)
          }
        }
      );

      it("dispatches actions.fetchReleases.started", () => {
        saga.dispatch(actions.fetchReleases.started({}));
      });

      it("makes a single API request", () => {
        expect(saga.ports.api.fetchReleases).toHaveBeenCalledTimes(1);
      });

      it("dispatches actions.fetchReleases.done with the expected result", () => {
        const matchingActions = saga.history.filter(
          actions.fetchReleases.done.match
        );

        expect(matchingActions).toHaveLength(1);
        expect(matchingActions[0].payload.result).toEqual(data);
      });
    });

    describe("when fetching releases, with a failed response", () => {
      const saga = new SagaTester(
        {},
        {
          api: {
            fetchReleases: mockWithFailure("Bad request")
          }
        }
      );

      it("dispatches actions.fetchReleases.started", () => {
        saga.dispatch(actions.fetchReleases.started({}));
      });

      it("makes a single API request", () => {
        expect(saga.ports.api.fetchReleases).toHaveBeenCalledTimes(1);
      });

      it("dispatches actions.fetchReleases.failed with expected error", () => {
        const matchingActions = saga.history.filter(
          actions.fetchReleases.failed.match
        );

        expect(matchingActions).toHaveLength(1);
        expect(matchingActions[0].payload.error).toBe("Bad request");
      });
    });
  });

  describe("fetchMoreReleasesSaga", () => {
    describe("when fetching more releases, with a successful response", () => {
      const saga = new SagaTester(
        {
          releases: {
            items: {
              "existing-item": {
                ...item,
                slug: "existing-item"
              }
            },
            lastEvaluatedKey: {
              isActive: "y",
              releasedOn: "2019-01-01",
              slug: "existing-item"
            }
          }
        },
        {
          api: {
            fetchReleases: mockWithSuccess(data)
          }
        }
      );

      it("dispatches actions.fetchMoreReleases.started", () => {
        saga.dispatch(actions.fetchMoreReleases.started({}));
      });

      it("makes a single API request", () => {
        expect(saga.ports.api.fetchReleases).toHaveBeenCalledTimes(1);
      });

      it("dispatches actions.fetchMoreReleases.done with expected result", () => {
        const matchingActions = saga.history.filter(
          actions.fetchMoreReleases.done.match
        );

        expect(matchingActions).toHaveLength(1);
        expect(matchingActions[0].payload.result).toEqual(data);
      });

      it("dispatches actions.trackEvent with expected payload", () => {
        const matchingActions = saga.history.filter(actions.trackEvent.match);

        expect(matchingActions).toHaveLength(1);
        expect(matchingActions[0].payload).toEqual({
          event: "releases.fetchedMore",
          itemCount: 2
        });
      });
    });

    describe("when fetching more releases, with a failed response", () => {
      const saga = new SagaTester(
        {},
        {
          api: {
            fetchReleases: mockWithFailure("Bad request")
          }
        }
      );

      it("dispatches actions.fetchMoreReleases.started", () => {
        saga.dispatch(actions.fetchMoreReleases.started({}));
      });

      it("makes a single API request", () => {
        expect(saga.ports.api.fetchReleases).toHaveBeenCalledTimes(1);
      });

      it("dispatches actions.fetchMoreReleases.failed with expected error", () => {
        const matchingActions = saga.history.filter(
          actions.fetchMoreReleases.failed.match
        );

        expect(matchingActions).toHaveLength(1);
        expect(matchingActions[0].payload.error).toBe("Bad request");
      });
    });
  });

  describe("fetchReleaseBySlugSaga", () => {
    describe("when fetching a release by slug, with a successful response", () => {
      const saga = new SagaTester(
        {},
        {
          api: {
            fetchReleaseBySlug: mockWithSuccess(item)
          }
        }
      );

      it("dispatches actions.fetchReleaseBySlug.started", () => {
        saga.dispatch(actions.fetchReleaseBySlug.started(item.slug));
      });

      it("makes a single API request", () => {
        expect(saga.ports.api.fetchReleaseBySlug).toHaveBeenCalledTimes(1);
      });

      it("dispatches actions.fetchReleaseBySlug.done with expected result", () => {
        const matchingActions = saga.history.filter(
          actions.fetchReleaseBySlug.done.match
        );

        expect(matchingActions).toHaveLength(1);
        expect(matchingActions[0].payload.result).toEqual(item);
      });
    });

    describe("when fetching a release by slug, with a failed response", () => {
      const saga = new SagaTester(
        {},
        {
          api: {
            fetchReleaseBySlug: mockWithFailure("Bad request")
          }
        }
      );

      it("dispatches actions.fetchReleaseBySlug.started", () => {
        saga.dispatch(actions.fetchReleaseBySlug.started(item.slug));
      });

      it("makes a single API request", () => {
        expect(saga.ports.api.fetchReleaseBySlug).toHaveBeenCalledTimes(1);
      });

      it("dispatches actions.fetchReleaseBySlug.failed with expected error", () => {
        const matchingActions = saga.history.filter(
          actions.fetchReleaseBySlug.failed.match
        );

        expect(matchingActions).toHaveLength(1);
        expect(matchingActions[0].payload.error).toBe("Bad request");
      });
    });
  });
});
