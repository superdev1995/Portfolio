import * as actions from "../actions/root.actions";
import { gallery, s3Response } from "../models/root.models";
import reducer, { initialState } from "./galleries.reducers";

const item1 = gallery({ slug: "test-1" });
const item2 = gallery({ slug: "test-2" });

describe("[reducers] Galleries", () => {
  describe("actions.fetchGalleries.started", () => {
    const state = reducer(
      {
        ...initialState,
        items: {
          [item1.slug]: item1
        }
      },
      actions.fetchGalleries.started({})
    );

    it("sets hasError to false", () => {
      expect(state.hasError).toBe(false);
    });

    it("sets isLoading to true", () => {
      expect(state.isLoading).toBe(true);
    });

    it("resets items", () => {
      expect(state.items).toEqual(initialState.items);
    });
  });

  describe("actions.fetchGalleries.done", () => {
    const result = s3Response({
      isTruncated: false,
      items: [item1, item2]
    });

    const state = reducer(
      {
        ...initialState,
        isLoading: true
      },
      actions.fetchGalleries.done({ result, params: {} })
    );

    it("sets hasAllItems to be the inverse of isTruncated", () => {
      expect(state.hasAllItems).toBe(!result.isTruncated);
    });

    it("sets isLoading to false", () => {
      expect(state.isLoading).toBe(false);
    });

    it("reduces items correctly", () => {
      expect(state.items).toEqual(result.items);
    });
  });

  describe("actions.fetchGalleries.failed", () => {
    const state = reducer(
      {
        ...initialState,
        isLoading: true
      },
      actions.fetchGalleries.failed({ error: "Error", params: {} })
    );

    it("sets hasError to true", () => {
      expect(state.hasError).toBe(true);
    });

    it("sets isLoading to false", () => {
      expect(state.isLoading).toBe(false);
    });
  });

  describe("actions.fetchMoreGalleries.started", () => {
    const items = {
      [item1.slug]: item1
    };

    const state = reducer(
      {
        ...initialState,
        hasError: true,
        items
      },
      actions.fetchMoreGalleries.started({})
    );

    it("sets hasError to false", () => {
      expect(state.hasError).toBe(false);
    });

    it("sets isLoading to true", () => {
      expect(state.isLoading).toBe(true);
    });

    it("doesn't reset items", () => {
      expect(state.items).toEqual(items);
    });
  });

  describe("actions.fetchMoreGalleries.done", () => {
    const result = s3Response({
      isTruncated: false,
      items: [item2]
    });

    const state = reducer(
      {
        ...initialState,
        isLoading: true,
        items: {
          [item1.slug]: item1
        }
      },
      actions.fetchMoreGalleries.done({ result, params: {} })
    );

    it("sets hasAllItems to be the inverse of isTruncated", () => {
      expect(state.hasAllItems).toBe(!result.isTruncated);
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
  });

  describe("actions.fetchMoreGalleries.failed", () => {
    const state = reducer(
      {
        ...initialState,
        isLoading: true
      },
      actions.fetchMoreGalleries.failed({ error: "Error", params: {} })
    );

    it("sets hasError to true", () => {
      expect(state.hasError).toBe(true);
    });

    it("sets isLoading to false", () => {
      expect(state.isLoading).toBe(false);
    });
  });

  describe("actions.setCurrentGallerySlug", () => {
    const state = reducer(
      initialState,
      actions.setCurrentGallerySlug(item1.slug)
    );

    it("sets currentSlug correctly", () => {
      expect(state.currentSlug).toEqual(item1.slug);
    });
  });

  describe("actions.fetchGalleryBySlug.started", () => {
    const state = reducer(
      {
        ...initialState,
        hasError: true
      },
      actions.fetchGalleryBySlug.started(item1.slug)
    );

    it("sets hasError to false", () => {
      expect(state.hasError).toBe(false);
    });

    it("sets isLoading to true", () => {
      expect(state.isLoading).toBe(true);
    });
  });

  describe("actions.fetchGalleryBySlug.done", () => {
    const state = reducer(
      {
        ...initialState,
        isLoading: true,
        items: {
          [item2.slug]: item2
        }
      },
      actions.fetchGalleryBySlug.done({
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

  describe("actions.fetchGalleryBySlug.failed", () => {
    const state = reducer(
      {
        ...initialState,
        isLoading: true
      },
      actions.fetchGalleryBySlug.failed({
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
