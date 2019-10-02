import { dynamoResponse, newsArticle } from "../models/root.models";
import { mockWithFailure, mockWithSuccess } from "../utilities/mocks";
import SagaTester from "../utilities/SagaTester";

import * as actions from "../actions/root.actions";

describe("[sagas] News", () => {
  const item = newsArticle({
    slug: "item-1"
  });
  const data = dynamoResponse({
    items: [item]
  });

  describe("fetchLatestNewsSaga", () => {
    describe("when fetching latest news, with a successful response", () => {
      const saga = new SagaTester(
        {},
        {
          api: {
            fetchNewsArticles: mockWithSuccess(data)
          }
        }
      );

      it("dispatches actions.fetchLatestNews.started", () => {
        saga.dispatch(actions.fetchLatestNews.started({}));
      });

      it("makes a single API request", () => {
        expect(saga.ports.api.fetchNewsArticles).toHaveBeenCalledTimes(1);
      });

      it("dispatches actions.fetchLatestNews.done with the expected result", () => {
        const matchingActions = saga.history.filter(
          actions.fetchLatestNews.done.match
        );

        expect(matchingActions).toHaveLength(1);
        expect(matchingActions[0].payload.result).toEqual(data);
      });
    });

    describe("when fetching latest news, with a failed response", () => {
      const saga = new SagaTester(
        {},
        {
          api: {
            fetchNewsArticles: mockWithFailure("Bad request")
          }
        }
      );

      it("dispatches actions.fetchLatestNews.started", () => {
        saga.dispatch(actions.fetchLatestNews.started({}));
      });

      it("makes a single API request", () => {
        expect(saga.ports.api.fetchNewsArticles).toHaveBeenCalledTimes(1);
      });

      it("dispatches actions.fetchLatestNews.failed with expected error", () => {
        const matchingActions = saga.history.filter(
          actions.fetchLatestNews.failed.match
        );

        expect(matchingActions).toHaveLength(1);
        expect(matchingActions[0].payload.error).toBe("Bad request");
      });
    });
  });

  describe("fetchMoreLatestNewsSaga", () => {
    describe("when fetching more latest news, with a successful response", () => {
      const saga = new SagaTester(
        {
          news: {
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
            fetchNewsArticles: mockWithSuccess(data)
          }
        }
      );

      it("dispatches actions.fetchMoreLatestNews.started", () => {
        saga.dispatch(actions.fetchMoreLatestNews.started({}));
      });

      it("makes a single API request", () => {
        expect(saga.ports.api.fetchNewsArticles).toHaveBeenCalledTimes(1);
      });

      it("dispatches actions.fetchMoreLatestNews.done with expected result", () => {
        const matchingActions = saga.history.filter(
          actions.fetchMoreLatestNews.done.match
        );

        expect(matchingActions).toHaveLength(1);
        expect(matchingActions[0].payload.result).toEqual(data);
      });

      it("dispatches actions.trackEvent with expected payload", () => {
        const matchingActions = saga.history.filter(actions.trackEvent.match);

        expect(matchingActions).toHaveLength(1);
        expect(matchingActions[0].payload).toEqual({
          event: "news.fetchedMore",
          itemCount: 2
        });
      });
    });

    describe("when fetching more latest news, with a failed response", () => {
      const saga = new SagaTester(
        {},
        {
          api: {
            fetchNewsArticles: mockWithFailure("Bad request")
          }
        }
      );

      it("dispatches actions.fetchMoreLatestNews.started", () => {
        saga.dispatch(actions.fetchMoreLatestNews.started({}));
      });

      it("makes a single API request", () => {
        expect(saga.ports.api.fetchNewsArticles).toHaveBeenCalledTimes(1);
      });

      it("dispatches actions.fetchMoreLatestNews.failed with expected error", () => {
        const matchingActions = saga.history.filter(
          actions.fetchMoreLatestNews.failed.match
        );

        expect(matchingActions).toHaveLength(1);
        expect(matchingActions[0].payload.error).toBe("Bad request");
      });
    });
  });

  describe("fetchNewsArticleBySlugSaga", () => {
    describe("when fetching an article by slug, with a successful response", () => {
      const saga = new SagaTester(
        {},
        {
          api: {
            fetchNewsArticleBySlug: mockWithSuccess(item)
          }
        }
      );

      it("dispatches actions.fetchNewsArticleBySlug.started", () => {
        saga.dispatch(actions.fetchNewsArticleBySlug.started(item.slug));
      });

      it("makes a single API request", () => {
        expect(saga.ports.api.fetchNewsArticleBySlug).toHaveBeenCalledTimes(1);
      });

      it("dispatches actions.fetchNewsArticleBySlug.done with expected result", () => {
        const matchingActions = saga.history.filter(
          actions.fetchNewsArticleBySlug.done.match
        );

        expect(matchingActions).toHaveLength(1);
        expect(matchingActions[0].payload.result).toEqual(item);
      });
    });

    describe("when fetching an article by slug, with a failed response", () => {
      const saga = new SagaTester(
        {},
        {
          api: {
            fetchNewsArticleBySlug: mockWithFailure("Bad request")
          }
        }
      );

      it("dispatches actions.fetchNewsArticleBySlug.started", () => {
        saga.dispatch(actions.fetchNewsArticleBySlug.started(item.slug));
      });

      it("makes a single API request", () => {
        expect(saga.ports.api.fetchNewsArticleBySlug).toHaveBeenCalledTimes(1);
      });

      it("dispatches actions.fetchNewsArticleBySlug.failed with expected error", () => {
        const matchingActions = saga.history.filter(
          actions.fetchNewsArticleBySlug.failed.match
        );

        expect(matchingActions).toHaveLength(1);
        expect(matchingActions[0].payload.error).toBe("Bad request");
      });
    });
  });
});
