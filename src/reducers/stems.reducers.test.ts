import * as actions from "../actions/root.actions";
import { BOOLEAN } from "../constants/api.constants";
import { dynamoResponse, stem } from "../models/root.models";
import reducer, { initialState } from "./stems.reducers";

const item1 = stem({ slug: "test-1" });
const item2 = stem({ slug: "test-2" });

describe("[reducers] Stems", () => {
  describe("actions.fetchStems.started", () => {
    const state = reducer(
      {
        ...initialState,
        items: {
          [item1.slug]: item1
        }
      },
      actions.fetchStems.started({})
    );

    it("sets isLoading to true", () => {
      expect(state.isLoading).toBe(true);
    });

    it("resets items", () => {
      expect(state.items).toEqual(initialState.items);
    });
  });

  describe("actions.fetchStems.done", () => {
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
        actions.fetchStems.done({ result, params: {} })
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
        actions.fetchStems.done({
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

  describe("actions.fetchStems.failed", () => {
    const state = reducer(
      {
        ...initialState,
        isLoading: true
      },
      actions.fetchStems.failed({ error: "Error", params: {} })
    );

    it("sets hasError to true", () => {
      expect(state.hasError).toBe(true);
    });

    it("sets isLoading to false", () => {
      expect(state.isLoading).toBe(false);
    });
  });

  describe("actions.fetchMoreStems.started", () => {
    const items = {
      [item1.slug]: item1
    };

    const state = reducer(
      {
        ...initialState,
        items
      },
      actions.fetchMoreStems.started({})
    );

    it("sets isLoading to true", () => {
      expect(state.isLoading).toBe(true);
    });

    it("doesn't reset items", () => {
      expect(state.items).toEqual(items);
    });
  });

  describe("actions.fetchMoreStems.done", () => {
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
        actions.fetchMoreStems.done({ result, params: {} })
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
        actions.fetchMoreStems.done({
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

  describe("actions.fetchMoreStems.failed", () => {
    const state = reducer(
      {
        ...initialState,
        isLoading: true
      },
      actions.fetchMoreStems.failed({ error: "Error", params: {} })
    );

    it("sets hasError to true", () => {
      expect(state.hasError).toBe(true);
    });

    it("sets isLoading to false", () => {
      expect(state.isLoading).toBe(false);
    });
  });
});
