import * as actions from "../actions/root.actions";
import { BOOLEAN } from "../constants/api.constants";
import { appearance, dynamoResponse } from "../models/root.models";
import reducer, { initialState } from "./appearances.reducers";

const item1 = appearance({ slug: "test-1" });
const item2 = appearance({ slug: "test-2" });

describe("[reducers] Appearances", () => {
  describe("actions.fetchAppearances.started", () => {
    const state = reducer(
      {
        ...initialState,
        items: {
          [item1.slug]: item1
        }
      },
      actions.fetchAppearances.started({})
    );

    it("sets isLoading to true", () => {
      expect(state.isLoading).toBe(true);
    });

    it("resets items", () => {
      expect(state.items).toEqual(initialState.items);
    });
  });

  describe("actions.fetchAppearances.done", () => {
    const result = dynamoResponse({
      items: [item1],
      lastEvaluatedKey: {
        isActive: BOOLEAN.TRUE,
        slug: item1.slug,
        startingAt: item1.startingAt
      }
    });

    describe("when lastEvaluatedKey is defined", () => {
      const state = reducer(
        {
          ...initialState,
          hasAllItems: true,
          isLoading: true
        },
        actions.fetchAppearances.done({ result, params: {} })
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
            slug: item1.slug,
            startingAt: item1.startingAt
          }
        },
        actions.fetchAppearances.done({
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

  describe("actions.fetchAppearances.failed", () => {
    const state = reducer(
      {
        ...initialState,
        isLoading: true
      },
      actions.fetchAppearances.failed({ error: "Error", params: {} })
    );

    it("sets hasError to true", () => {
      expect(state.hasError).toBe(true);
    });

    it("sets isLoading to false", () => {
      expect(state.isLoading).toBe(false);
    });
  });

  describe("actions.fetchMoreAppearances.started", () => {
    const items = {
      [item1.slug]: item1
    };

    const state = reducer(
      {
        ...initialState,
        items
      },
      actions.fetchMoreAppearances.started({})
    );

    it("sets isLoading to true", () => {
      expect(state.isLoading).toBe(true);
    });

    it("doesn't reset items", () => {
      expect(state.items).toEqual(items);
    });
  });

  describe("actions.fetchMoreAppearances.done", () => {
    const result = dynamoResponse({
      items: [item2],
      lastEvaluatedKey: {
        isActive: BOOLEAN.TRUE,
        slug: item2.slug,
        startingAt: item2.startingAt
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
        actions.fetchMoreAppearances.done({ result, params: {} })
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
        actions.fetchMoreAppearances.done({
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

  describe("actions.fetchMoreAppearances.failed", () => {
    const state = reducer(
      {
        ...initialState,
        isLoading: true
      },
      actions.fetchMoreAppearances.failed({ error: "Error", params: {} })
    );

    it("sets hasError to true", () => {
      expect(state.hasError).toBe(true);
    });

    it("sets isLoading to false", () => {
      expect(state.isLoading).toBe(false);
    });
  });

  describe("actions.setCurrentAppearanceSlug", () => {
    const state = reducer(
      initialState,
      actions.setCurrentAppearanceSlug(item1.slug)
    );

    it("sets currentSlug correctly", () => {
      expect(state.currentSlug).toBe(item1.slug);
    });
  });

  describe("actions.fetchAppearanceBySlug.started", () => {
    const state = reducer(
      {
        ...initialState,
        hasError: true
      },
      actions.fetchAppearanceBySlug.started(item1.slug)
    );

    it("sets hasError to false", () => {
      expect(state.hasError).toBe(false);
    });

    it("sets isLoading to true", () => {
      expect(state.isLoading).toBe(true);
    });
  });

  describe("actions.fetchAppearanceBySlug.done", () => {
    const state = reducer(
      {
        ...initialState,
        isLoading: true,
        items: {
          [item2.slug]: item2
        }
      },
      actions.fetchAppearanceBySlug.done({
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

  describe("actions.fetchAppearanceBySlug.failed", () => {
    const state = reducer(
      {
        ...initialState,
        isLoading: true
      },
      actions.fetchAppearanceBySlug.failed({
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

  describe("actions.geocodeCurrentAppearanceAddress.started", () => {
    const state = reducer(
      {
        ...initialState,
        currentLocation: { lat: 0, lng: 0 }
      },
      actions.geocodeCurrentAppearanceAddress.started({})
    );

    it("sets currentLocation to be undefined", () => {
      expect(state.currentLocation).toBeUndefined();
    });
  });

  describe("actions.geocodeCurrentAppearanceAddress.done", () => {
    const result = { lat: 0, lng: 0 };

    const state = reducer(
      initialState,
      actions.geocodeCurrentAppearanceAddress.done({
        params: {},
        result
      })
    );

    it("reduces currentLocation correctly", () => {
      expect(state.currentLocation).toEqual(result);
    });
  });
});
