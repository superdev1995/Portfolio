import * as actions from "../actions/root.actions";
import SagaTester from "../utilities/SagaTester";

describe("[sagas] Features", () => {
  describe("addFeaturesSaga", () => {
    describe("when adding features", () => {
      const feature1 = "test-feature-1";
      const feature2 = "test-feature-2";
      const feature3 = "test-feature-3";
      const saga = new SagaTester(
        {},
        {
          features: []
        }
      );

      it("has correct initial state", () => {
        expect(saga.ports.features).toEqual([]);
      });

      it("dispatches actions.addFeature with a single feature", () => {
        saga.dispatch(actions.addFeatures(feature1));
      });

      it("adds the feature to the `window.features` array", () => {
        expect(saga.ports.features).toEqual([feature1]);
      });

      it("dispatches actions.addFeature a second time with the same feature", () => {
        saga.dispatch(actions.addFeatures(feature1));
      });

      it("doesn't duplicate the feature in the `window.features` array", () => {
        expect(saga.ports.features).toEqual([feature1]);
      });

      it("dispatches actions.addFeature with two features", () => {
        saga.dispatch(actions.addFeatures([feature2, feature3]));
      });

      it("has all three features in the `window.features` array", () => {
        expect(saga.ports.features).toEqual([feature1, feature2, feature3]);
      });
    });
  });

  describe("removeFeaturesSaga", () => {
    describe("when removing features", () => {
      const feature1 = "test-feature-1";
      const feature2 = "test-feature-2";
      const feature3 = "test-feature-3";
      const saga = new SagaTester(
        {},
        {
          features: [feature1, feature2, feature3]
        }
      );

      it("has correct initial state", () => {
        expect(saga.ports.features).toEqual([feature1, feature2, feature3]);
      });

      it("dispatches actions.removeFeatures with a single feature", () => {
        saga.dispatch(actions.removeFeatures(feature1));
      });

      it("removes the feature from the `window.features` array", () => {
        expect(saga.ports.features).toEqual([feature2, feature3]);
      });

      it("dispatches actions.removeFeatures with two features", () => {
        saga.dispatch(actions.removeFeatures([feature2, feature3]));
      });

      it("removes the remaining features from the `window.features` array", () => {
        expect(saga.ports.features).toEqual([]);
      });
    });
  });
});
