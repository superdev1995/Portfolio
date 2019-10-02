import * as actions from "../actions/root.actions";
import { BOOLEAN } from "../constants/api.constants";
import { dynamoResponse, newsArticle } from "../models/root.models";
import reducer, { initialState } from "./news.reducers";

const item1 = newsArticle({ slug: "test-1" });
const item2 = newsArticle({ slug: "test-2" });

describe("[reducers] News", () => {
  describe("actions.fetchLatestNews.started", () => {
    const state = reducer(
      {
        ...initialState,
        items: {
          [item1.slug]: item1
        }
      },
      actions.fetchLatestNews.started({})
    );

    it("sets isLoading to true", () => {
      expect(state.isLoading).toBe(true);
    });

    it("resets items", () => {
      expect(state.items).toEqual(initialState.items);
    });
  });

  describe("actions.fetchLatestNews.done", () => {
    const result = dynamoResponse({
      items: [item1],
      lastEvaluatedKey: {
        createdAt: item1.createdAt,
        isActive: BOOLEAN.TRUE,
        slug: item1.slug
      }
    });

    describe("when lastEvaluatedKey is defined", () => {
      const state = reducer(
        {
          ...initialState,
          hasAllItems: true,
          isLoading: true
        },
        actions.fetchLatestNews.done({ result, params: {} })
      );

      it("sets hasAllItems to false", () => {
        expect(state.hasAllItems).toBe(false);
      });

      it("sets isLoading to false", () => {
        expect(state.isLoading).toBe(false);
      });

      it("reduces the items correctly", () => {
        expect(state.items).toEqual(result.items);
      });

      it("reduces lastEvaluatedKey correctly", () => {
        expect(state.lastEvaluatedKey).toEqual(result.lastEvaluatedKey);
      });
    });

    describe("when lastEvaluatedKey isn't defined", () => {
      const state = reducer(
        {
          ...initialState,
          hasAllItems: false,
          isLoading: true,
          lastEvaluatedKey: {
            createdAt: item1.createdAt,
            isActive: BOOLEAN.TRUE,
            slug: item1.slug
          }
        },
        actions.fetchLatestNews.done({
          params: {},
          result: {
            ...result,
            lastEvaluatedKey: undefined
          }
        })
      );

      it("sets isLoading to false", () => {
        expect(state.isLoading).toBe(false);
      });

      it("sets hasAllItems to true", () => {
        expect(state.hasAllItems).toBe(true);
      });

      it("reduces the items correctly", () => {
        expect(state.items).toEqual(result.items);
      });

      it("sets lastEvaluatedKey to be undefined", () => {
        expect(state.lastEvaluatedKey).toBeUndefined();
      });
    });
  });

  describe("actions.fetchLatestNews.failed", () => {
    const state = reducer(
      {
        ...initialState,
        isLoading: true
      },
      actions.fetchLatestNews.failed({ error: "Error", params: {} })
    );

    it("sets hasError to true", () => {
      expect(state.hasError).toBe(true);
    });

    it("sets isLoading to false", () => {
      expect(state.isLoading).toBe(false);
    });
  });

  describe("actions.fetchMoreLatestNews.started", () => {
    const items = {
      [item1.slug]: item1
    };

    const state = reducer(
      {
        ...initialState,
        items
      },
      actions.fetchMoreLatestNews.started({})
    );

    it("sets isLoading to true", () => {
      expect(state.isLoading).toBe(true);
    });

    it("doesn't reset items", () => {
      expect(state.items).toEqual(items);
    });
  });

  describe("actions.fetchMoreLatestNews.done", () => {
    const result = dynamoResponse({
      items: [item2],
      lastEvaluatedKey: {
        createdAt: item2.createdAt,
        isActive: BOOLEAN.TRUE,
        slug: item2.slug
      }
    });

    describe("when lastEvaluatedKey is defined", () => {
      const state = reducer(
        {
          ...initialState,
          hasAllItems: true,
          isLoading: true,
          items: {
            [item1.slug]: item1
          }
        },
        actions.fetchMoreLatestNews.done({ result, params: {} })
      );

      it("sets hasAllItems to false", () => {
        expect(state.hasAllItems).toBe(false);
      });

      it("sets isLoading to false", () => {
        expect(state.isLoading).toBe(false);
      });

      it("merges the items from the payload with the ones in the store", () => {
        expect(state.items).toEqual({
          [item1.slug]: item1,
          [item2.slug]: item2
        });
      });

      it("reduces lastEvaluatedKey correctly", () => {
        expect(state.lastEvaluatedKey).toEqual(result.lastEvaluatedKey);
      });
    });

    describe("when lastEvaluatedKey isn't defined", () => {
      const state = reducer(
        {
          ...initialState,
          hasAllItems: false,
          isLoading: true,
          items: {
            [item1.slug]: item1
          }
        },
        actions.fetchMoreLatestNews.done({
          params: {},
          result: {
            ...result,
            lastEvaluatedKey: undefined
          }
        })
      );

      it("sets hasAllItems to true", () => {
        expect(state.hasAllItems).toBe(true);
      });

      it("sets isLoading to false", () => {
        expect(state.isLoading).toBe(false);
      });

      it("merges the items from the payload with the ones in the store", () => {
        expect(state.items).toEqual({
          [item1.slug]: item1,
          [item2.slug]: item2
        });
      });

      it("sets lastEvaluatedKey to be undefined", () => {
        expect(state.lastEvaluatedKey).toBeUndefined();
      });
    });
  });

  describe("actions.fetchMoreLatestNews.failed", () => {
    const state = reducer(
      {
        ...initialState,
        isLoading: true
      },
      actions.fetchMoreLatestNews.failed({ error: "Error", params: {} })
    );

    it("sets hasError to true", () => {
      expect(state.hasError).toBe(true);
    });

    it("sets isLoading to false", () => {
      expect(state.isLoading).toBe(false);
    });
  });

  describe("actions.setCurrentNewsArticleSlug", () => {
    const state = reducer(
      initialState,
      actions.setCurrentNewsArticleSlug(item1.slug)
    );

    it("sets currentSlug correctly", () => {
      expect(state.currentSlug).toBe(item1.slug);
    });
  });

  describe("actions.fetchNewsArticleBySlug.started", () => {
    const state = reducer(
      {
        ...initialState,
        hasError: true
      },
      actions.fetchNewsArticleBySlug.started(item1.slug)
    );

    it("sets hasError to false", () => {
      expect(state.hasError).toBe(false);
    });

    it("sets isLoading to true", () => {
      expect(state.isLoading).toBe(true);
    });
  });

  describe("actions.fetchNewsArticleBySlug.done", () => {
    const state = reducer(
      {
        ...initialState,
        isLoading: true,
        items: {
          [item2.slug]: item2
        }
      },
      actions.fetchNewsArticleBySlug.done({
        params: item1.slug,
        result: item1
      })
    );

    it("sets isLoading to false", () => {
      expect(state.isLoading).toBe(false);
    });

    it("adds the item to the store", () => {
      expect(state.items).toEqual({
        [item2.slug]: item2,
        [item1.slug]: item1
      });
    });
  });

  describe("actions.fetchNewsArticleBySlug.failed", () => {
    const state = reducer(
      {
        ...initialState,
        isLoading: true
      },
      actions.fetchNewsArticleBySlug.failed({
        error: "Error",
        params: item1.slug
      })
    );

    it("sets hasError to true", () => {
      expect(state.hasError).toBe(true);
    });

    it("sets isLoading to false", () => {
      expect(state.isLoading).toBe(false);
    });
  });
});
