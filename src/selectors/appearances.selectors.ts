import { createSelector, defaultMemoize } from "reselect";

import { TStoreState } from "../reducers/root.reducers";

export const hasAppearancesError = (state: TStoreState) =>
  state.appearances.hasError;

export const getAppearances = defaultMemoize(
  (state: TStoreState) => state.appearances.items
);

export const getAppearancesCount = createSelector(
  getAppearances,
  appearances => Object.keys(appearances).length
);

export const getAppearancesAsArray = createSelector(
  getAppearances,
  appearances => Object.values(appearances)
);

export const getUpcomingAppearances = createSelector(
  getAppearancesAsArray,
  appearances =>
    appearances
      .filter(appearance => appearance.finishingAt > new Date().toISOString())
      .sort(
        (a, b) =>
          new Date(a.startingAt).getTime() - new Date(b.startingAt).getTime()
      )
);

export const getPastAppearances = createSelector(
  getAppearancesAsArray,
  appearances =>
    appearances
      .filter(appearance => appearance.finishingAt <= new Date().toISOString())
      .sort(
        (a, b) =>
          new Date(b.startingAt).getTime() - new Date(a.startingAt).getTime()
      )
);

export const getCurrentAppearanceSlug = (state: TStoreState) =>
  state.appearances.currentSlug;

export const getCurrentAppearance = createSelector(
  getAppearances,
  getCurrentAppearanceSlug,
  (appearances, slug) => (slug ? appearances[slug] : undefined)
);

export const getAppearancesLastEvaluatedKey = (state: TStoreState) =>
  state.appearances.lastEvaluatedKey;

export const getAppearancesLastEvaluatedKeyAsString = createSelector(
  getAppearancesLastEvaluatedKey,
  lastEvaluatedKey =>
    !lastEvaluatedKey
      ? undefined
      : btoa(
          encodeURIComponent(
            JSON.stringify({
              IsActive: lastEvaluatedKey.isActive,
              Slug: lastEvaluatedKey.slug,
              StartingAt: lastEvaluatedKey.startingAt
            })
          )
        )
);

export const getHasAllAppearances = (state: TStoreState) =>
  state.appearances.hasAllItems;

export const getAppearancesIsLoading = (state: TStoreState) =>
  state.appearances.isLoading;

export const getCurrentAppearanceLocation = (state: TStoreState) =>
  state.appearances.currentLocation;
