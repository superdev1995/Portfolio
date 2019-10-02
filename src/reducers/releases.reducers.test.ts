import * as actions from "../actions/root.actions";
import { BOOLEAN } from "../constants/api.constants";
import { dynamoResponse, release } from "../models/root.models";
import reducer, { initialState } from "./releases.reducers";

const item1 = release({ slug: "test-1" });
const item2 = release({ slug: "test-2" });

describe("[reducers] Release", () => {
  describe("actions.fetchReleases.started", () => {
    const state = reducer(
      {
        ...initialState,
        items: {
          [item1.slug]: item1
        }
      },
      actions.fetchReleases.started({})
    );

    it("sets isLoading to true", () => {
      expect(state.isLoading).toBe(true);
    });

    it("resets items", () => {
      expect(state.items).toEqual(initialState.items);
    });
  });

  describe("actions.fetchReleases.done", () => {
    const result = dynamoResponse({
      items: [item1],
      lastEvaluatedKey: {
        isActive: BOOLEAN.TRUE,
        releasedOn: item1.releasedOn,
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
        actions.fetchReleases.done({ result, params: {} })
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
            isActive: BOOLEAN.TRUE,
            releasedOn: item1.releasedOn,
            slug: item1.slug
          }
        },
        actions.fetchReleases.done({
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

  describe("actions.fetchReleases.failed", () => {
    const state = reducer(
      {
        ...initialState,
        isLoading: true
      },
      actions.fetchReleases.failed({ error: "Error", params: {} })
    );

    it("sets hasError to true", () => {
      expect(state.hasError).toBe(true);
    });

    it("sets isLoading to false", () => {
      expect(state.isLoading).toBe(false);
    });
  });

  describe("actions.fetchMoreReleases.started", () => {
    const items = {
      [item1.slug]: item1
    };

    const state = reducer(
      {
        ...initialState,
        items
      },
      actions.fetchMoreReleases.started({})
    );

    it("sets isLoading to true", () => {
      expect(state.isLoading).toBe(true);
    });

    it("doesn't reset items", () => {
      expect(state.items).toEqual(items);
    });
  });

  describe("actions.fetchMoreReleases.done", () => {
    const result = dynamoResponse({
      items: [item2],
      lastEvaluatedKey: {
        isActive: BOOLEAN.TRUE,
        releasedOn: item2.releasedOn,
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
        actions.fetchMoreReleases.done({ result, params: {} })
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
        actions.fetchMoreReleases.done({
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

  describe("actions.fetchMoreReleases.failed", () => {
    const state = reducer(
      {
        ...initialState,
        isLoading: true
      },
      actions.fetchMoreReleases.failed({ error: "Error", params: {} })
    );

    it("sets hasError to true", () => {
      expect(state.hasError).toBe(true);
    });

    it("sets isLoading to false", () => {
      expect(state.isLoading).toBe(false);
    });
  });

  describe("actions.setCurrentReleaseSlug", () => {
    const state = reducer(
      initialState,
      actions.setCurrentReleaseSlug(item1.slug)
    );

    it("sets currentSlug correctly", () => {
      expect(state.currentSlug).toBe(item1.slug);
    });
  });

  describe("actions.fetchReleaseBySlug.started", () => {
    const state = reducer(
      {
        ...initialState,
        hasError: true
      },
      actions.fetchReleaseBySlug.started(item1.slug)
    );

    it("sets hasError to false", () => {
      expect(state.hasError).toBe(false);
    });

    it("sets isLoading to true", () => {
      expect(state.isLoading).toBe(true);
    });
  });

  describe("actions.fetchReleaseBySlug.done", () => {
    const state = reducer(
      {
        ...initialState,
        isLoading: true,
        items: {
          [item2.slug]: item2
        }
      },
      actions.fetchReleaseBySlug.done({
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

  describe("actions.fetchReleaseBySlug.failed", () => {
    const state = reducer(
      {
        ...initialState,
        isLoading: true
      },
      actions.fetchReleaseBySlug.failed({
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
