import reducer, { initialState } from "./app.reducers";

import * as actions from "../actions/root.actions";
import * as models from "../models/root.models";

describe("[reducers] App", () => {
  describe("actions.setOnlineStatus", () => {
    const state = reducer(initialState, actions.setOnlineStatus(false));

    it("sets isOnline to the payload", () => {
      expect(state.isOnline).toBe(false);
    });
  });

  describe("actions.setHasNewVersion", () => {
    const state = reducer(initialState, actions.setHasNewVersion(true));

    it("sets hasNewVersion to the payload", () => {
      expect(state.hasNewVersion).toBe(true);
    });
  });

  describe("actions.toggleNavigation", () => {
    const state1 = reducer(initialState, actions.toggleNavigation());
    const state2 = reducer(state1, actions.toggleNavigation());

    it("toggles isNavOpen correctly", () => {
      expect(state1.isNavOpen).toBe(true);
      expect(state2.isNavOpen).toEqual(false);
    });
  });

  describe("actions.setCurrentRoute", () => {
    const payload = "/";
    const state = reducer(initialState, actions.setCurrentRoute(payload));

    it("sets currentRoute to the payload", () => {
      expect(state.currentRoute).toEqual(payload);
    });
  });

  describe("actions.changeRoute.started", () => {
    const payload = "/";
    const state = reducer(initialState, actions.changeRoute.started(payload));

    it("sets isLoading to true", () => {
      expect(state.isLoading).toBe(true);
    });

    it("sets transitioningTo to the payload", () => {
      expect(state.transitioningTo).toBe(payload);
    });
  });

  describe("actions.changeRoute.done", () => {
    const params = "/";
    const state = reducer(
      initialState,
      actions.changeRoute.done({ params, result: {} })
    );

    it("sets isLoading to false", () => {
      expect(state.isLoading).toBe(false);
    });

    it("sets transitioningTo to be undefined", () => {
      expect(state.transitioningTo).toBeUndefined();
    });
  });

  describe("actions.changeRoute.failed", () => {
    const params = "/";
    const error = { message: "Error", status: 500 };

    const state = reducer(
      initialState,
      actions.changeRoute.failed({ error, params })
    );

    it("sets error correctly", () => {
      expect(state.error).toEqual(error);
    });

    it("sets isLoading to false", () => {
      expect(state.isLoading).toBe(false);
    });

    it("sets transitioningTo to be undefined", () => {
      expect(state.transitioningTo).toBeUndefined();
    });
  });

  describe("Individual entity request failures", () => {
    describe("actions.fetchAppearanceBySlug.failed", () => {
      const state = reducer(
        initialState,
        actions.fetchAppearanceBySlug.failed({
          error: "Error",
          params: "test-1"
        })
      );

      it("sets error to be a 404", () => {
        expect(state.error).toEqual(models.error({ status: 404 }));
      });
    });

    describe("actions.fetchGalleryBySlug.failed", () => {
      const state = reducer(
        initialState,
        actions.fetchGalleryBySlug.failed({ params: "test-1", error: "Error" })
      );

      it("sets error to be a 404", () => {
        expect(state.error).toEqual(models.error({ status: 404 }));
      });
    });

    describe("actions.fetchNewsArticleBySlug.failed", () => {
      const state = reducer(
        initialState,
        actions.fetchNewsArticleBySlug.failed({
          error: "Error",
          params: "test-1"
        })
      );

      it("sets error to be a 404", () => {
        expect(state.error).toEqual(models.error({ status: 404 }));
      });
    });

    describe("actions.fetchReleaseBySlug.failed", () => {
      const state = reducer(
        initialState,
        actions.fetchReleaseBySlug.failed({ params: "test-1", error: "Error" })
      );

      it("sets error to be a 404", () => {
        expect(state.error).toEqual(models.error({ status: 404 }));
      });
    });
  });
});
