import { createSelector, defaultMemoize } from "reselect";

import { TStoreState } from "../reducers/root.reducers";

export const hasStemsError = (state: TStoreState) => state.stems.hasError;

export const getStems = defaultMemoize(
  (state: TStoreState) => state.stems.items
);

export const getStemsCount = createSelector(
  getStems,
  stems => Object.keys(stems).length
);

export const getStemsAsArray = createSelector(
  getStems,
  stems =>
    Object.values(stems).sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )
);

export const getStemsLastEvaluatedKey = (state: TStoreState) =>
  state.stems.lastEvaluatedKey;

export const getStemsLastEvaluatedKeyAsString = createSelector(
  getStemsLastEvaluatedKey,
  lastEvaluatedKey =>
    !lastEvaluatedKey
      ? undefined
      : btoa(
          encodeURIComponent(
            JSON.stringify({
              CreatedAt: lastEvaluatedKey.createdAt,
              IsActive: lastEvaluatedKey.isActive,
              Slug: lastEvaluatedKey.slug
            })
          )
        )
);

export const getHasAllStems = (state: TStoreState) => state.stems.hasAllItems;

export const getStemsIsLoading = (state: TStoreState) => state.stems.isLoading;
