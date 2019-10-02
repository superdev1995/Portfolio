import * as selectors from "./features.selectors";

describe("[selectors] Features", () => {
  it("returns `true` when feature exists", () => {
    const state: any = {
      features: {
        items: ["has-feature"]
      }
    };

    expect(selectors.hasFeature(state, "has-feature")).toBe(true);
  });

  it("returns `false` when feature doesn't exist", () => {
    const state: any = {
      features: {
        items: []
      }
    };

    expect(selectors.hasFeature(state, "has-feature")).toBe(false);
  });
});
