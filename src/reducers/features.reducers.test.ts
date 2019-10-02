import reducer, { initialState } from "./features.reducers";

import * as actions from "../actions/root.actions";

describe("[reducers] Features", () => {
  describe("actions.addFeatures", () => {
    describe("when the payload is a string", () => {
      const feature = "has-test-feature";
      const state1 = reducer(initialState, actions.addFeatures(feature));

      it("reduces the feature correctly", () => {
        expect(state1.items).toEqual([feature]);
      });

      it("doesn't duplicate the feature when added consecutively", () => {
        const state2 = reducer(state1, actions.addFeatures(feature));
        expect(state2.items).toHaveLength(1);
      });
    });

    describe("when the payload is an array", () => {
      const features = ["has-test-feature-1", "has-test-feature-2"];
      const state1 = reducer(initialState, actions.addFeatures(features));

      it("reduces the features correctly", () => {
        expect(state1.items).toEqual(features);
      });

      it("doesn't duplicate the features when added consecutively", () => {
        const state2 = reducer(state1, actions.addFeatures(features));
        expect(state2.items).toEqual(features);
      });
    });
  });

  describe("actions.removeFeatures", () => {
    it("removes the feature when the payload is a string", () => {
      const feature = "has-test-feature";
      const state = reducer(
        { items: [feature] },
        actions.removeFeatures(feature)
      );

      expect(state.items).toEqual([]);
    });

    it("removes the features when payload is an array", () => {
      const features = ["has-test-feature-1", "has-test-feature-2"];
      const state = reducer(
        { items: features },
        actions.removeFeatures(features)
      );

      expect(state.items).toEqual([]);
    });
  });
});
