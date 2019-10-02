import reducer, { initialState } from "./intl.reducers";

import * as actions from "../actions/root.actions";

describe("[reducers] Intl", () => {
  describe("actions.initApp.started", () => {
    describe("when all parameters are defined", () => {
      const state = reducer(
        initialState,
        actions.initApp.started({ locale: "en-US" })
      );

      it("sets locale correctly", () => {
        expect(state.locale).toBe("en-US");
      });
    });

    describe("when no parameters are defined", () => {
      const state = reducer(initialState, actions.initApp.started({}));

      it("doesn't modify locale", () => {
        expect(state.locale).toBe(initialState.locale);
      });
    });
  });
});
