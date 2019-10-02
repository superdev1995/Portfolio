import { gallery, s3Response } from "../models/root.models";
import { mockWithFailure, mockWithSuccess } from "../utilities/mocks";
import SagaTester from "../utilities/SagaTester";

import * as actions from "../actions/root.actions";

describe("[sagas] Galleries", () => {
  const item = gallery({ slug: "test-1" });
  const data = s3Response({
    items: [item]
  });

  describe("fetchGalleriesSaga", () => {
    describe("when fetching galleries, with a successful response", () => {
      const saga = new SagaTester(
        {},
        {
          api: {
            fetchGalleries: mockWithSuccess(data)
          }
        }
      );

      it("dispatches actions.fetchGalleries.started", () => {
        saga.dispatch(actions.fetchGalleries.started({}));
      });

      it("makes a single API request", () => {
        expect(saga.ports.api.fetchGalleries).toHaveBeenCalledTimes(1);
      });

      it("dispatches actions.fetchGalleries.done with expected result", () => {
        const matchingActions = saga.history.filter(
          actions.fetchGalleries.done.match
        );

        expect(matchingActions).toHaveLength(1);
        expect(matchingActions[0].payload.result).toEqual(data);
      });
    });

    describe("when fetching galleries, with a failed response", () => {
      const saga = new SagaTester(
        {},
        {
          api: {
            fetchGalleries: mockWithFailure("Bad request")
          }
        }
      );

      it("dispatches actions.fetchGalleries.started", () => {
        saga.dispatch(actions.fetchGalleries.started({}));
      });

      it("makes a single API request", () => {
        expect(saga.ports.api.fetchGalleries).toHaveBeenCalledTimes(1);
      });

      it("dispatches actions.fetchGalleries.failed with expected error", () => {
        const matchingActions = saga.history.filter(
          actions.fetchGalleries.failed.match
        );

        expect(matchingActions).toHaveLength(1);
        expect(matchingActions[0].payload.error).toBe("Bad request");
      });
    });
  });

  describe("fetchMoreGalleriesSaga", () => {
    describe("when fetching more galleries, with a successful response", () => {
      const saga = new SagaTester(
        {
          galleries: {
            items: {
              "existing-item": {
                ...item,
                slug: "existing-item"
              }
            }
          }
        },
        {
          api: {
            fetchGalleries: mockWithSuccess(data)
          }
        }
      );

      it("dispatches actions.fetchMoreGalleries.started", () => {
        saga.dispatch(actions.fetchMoreGalleries.started({}));
      });

      it("makes a single API request", () => {
        expect(saga.ports.api.fetchGalleries).toHaveBeenCalledTimes(1);
      });

      it("dispatches actions.fetchMoreGalleries.done with expected result", () => {
        const matchingActions = saga.history.filter(
          actions.fetchMoreGalleries.done.match
        );

        expect(matchingActions).toHaveLength(1);
        expect(matchingActions[0].payload.result).toEqual(data);
      });

      it("dispatches actions.trackEvent with expected payload", () => {
        const matchingActions = saga.history.filter(actions.trackEvent.match);

        expect(matchingActions).toHaveLength(1);
        expect(matchingActions[0].payload).toEqual({
          event: "galleries.fetchedMore",
          itemCount: 2
        });
      });
    });

    describe("when fetching more galleries, with a failed response", () => {
      const saga = new SagaTester(
        {},
        {
          api: {
            fetchGalleries: mockWithFailure("Bad request")
          }
        }
      );

      it("dispatches actions.fetchMoreGalleries.started", () => {
        saga.dispatch(actions.fetchMoreGalleries.started({}));
      });

      it("makes a single API request", () => {
        expect(saga.ports.api.fetchGalleries).toHaveBeenCalledTimes(1);
      });

      it("dispatches actions.fetchMoreGalleries.failed with expected error", () => {
        const matchingActions = saga.history.filter(
          actions.fetchMoreGalleries.failed.match
        );

        expect(matchingActions).toHaveLength(1);
        expect(matchingActions[0].payload.error).toBe("Bad request");
      });
    });
  });

  describe("fetchGalleryBySlugSaga", () => {
    describe("when fetching a gallery by slug, with a successful response", () => {
      const saga = new SagaTester(
        {},
        {
          api: {
            fetchGalleryBySlug: mockWithSuccess(item)
          }
        }
      );

      it("dispatches actions.fetchGalleryBySlug.started", () => {
        saga.dispatch(actions.fetchGalleryBySlug.started(item.slug));
      });

      it("makes a single API request", () => {
        expect(saga.ports.api.fetchGalleryBySlug).toHaveBeenCalledTimes(1);
      });

      it("dispatches actions.fetchGalleryBySlug.done with expected result", () => {
        const matchingActions = saga.history.filter(
          actions.fetchGalleryBySlug.done.match
        );

        expect(matchingActions).toHaveLength(1);
        expect(matchingActions[0].payload.result).toEqual(item);
      });
    });

    describe("when fetching a gallery by slug, with a failed response", () => {
      const saga = new SagaTester(
        {},
        {
          api: {
            fetchGalleryBySlug: mockWithFailure("Bad request")
          }
        }
      );

      it("dispatches actions.fetchGalleryBySlug.started", () => {
        saga.dispatch(actions.fetchGalleryBySlug.started(item.slug));
      });

      it("makes a single API request", () => {
        expect(saga.ports.api.fetchGalleryBySlug).toHaveBeenCalledTimes(1);
      });

      it("dispatches actions.fetchGalleryBySlug.failed with expected error", () => {
        const matchingActions = saga.history.filter(
          actions.fetchGalleryBySlug.failed.match
        );

        expect(matchingActions).toHaveLength(1);
        expect(matchingActions[0].payload.error).toBe("Bad request");
      });
    });
  });
});
