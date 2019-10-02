import * as actions from "../actions/root.actions";
import { BOOLEAN } from "../constants/api.constants";
import { dynamoResponse, resource } from "../models/root.models";
import reducer, { initialState } from "./resources.reducers";

const item1 = resource({ slug: "test-1" });
const item2 = resource({ slug: "test-2" });

describe("[reducers] Resources", () => {
  describe("actions.fetchResources.started", () => {
    const state = reducer(
      {
        ...initialState,
        items: {
          [item1.slug]: item1
        }
      },
      actions.fetchResources.started({})
    );

    it("sets isLoading to true", () => {
      expect(state.isLoading).toBe(true);
    });

    it("resets items", () => {
      expect(state.items).toEqual(initialState.items);
    });
  });

  describe("actions.fetchResources.done", () => {
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
        actions.fetchResources.done({ result, params: {} })
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
        actions.fetchResources.done({
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

  describe("actions.fetchResources.failed", () => {
    const state = reducer(
      {
        ...initialState,
        isLoading: true
      },
      actions.fetchResources.failed({ error: "Error", params: {} })
    );

    it("sets hasError to true", () => {
      expect(state.hasError).toBe(true);
    });

    it("sets isLoading to false", () => {
      expect(state.isLoading).toBe(false);
    });
  });

  describe("actions.fetchMoreResources.started", () => {
    const items = {
      [item1.slug]: item1
    };

    const state = reducer(
      {
        ...initialState,
        items
      },
      actions.fetchMoreResources.started({})
    );

    it("sets isLoading to true", () => {
      expect(state.isLoading).toBe(true);
    });

    it("doesn't reset items", () => {
      expect(state.items).toEqual(items);
    });
  });

  describe("actions.fetchMoreResources.done", () => {
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
        actions.fetchMoreResources.done({ result, params: {} })
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
        actions.fetchMoreResources.done({
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

  describe("actions.fetchMoreResources.failed", () => {
    const state = reducer(
      {
        ...initialState,
        isLoading: true
      },
      actions.fetchMoreResources.failed({ error: "Error", params: {} })
    );

    it("sets hasError to true", () => {
      expect(state.hasError).toBe(true);
    });

    it("sets isLoading to false", () => {
      expect(state.isLoading).toBe(false);
    });
  });
});
