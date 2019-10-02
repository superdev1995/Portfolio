import { createSelector, defaultMemoize } from "reselect";

import { TYPE } from "../constants/release.constants";
import { IRelease } from "../models/root.models";
import { TStoreState } from "../reducers/root.reducers";

export const hasReleasesError = (state: TStoreState) => state.releases.hasError;

export const getReleases = defaultMemoize(
  (state: TStoreState) => state.releases.items
);

export const getReleasesCount = createSelector(
  getReleases,
  releases => Object.keys(releases).length
);

export const getReleasesAsArray = createSelector(
  getReleases,
  releases =>
    Object.values(releases).sort(
      (a, b) =>
        new Date(a.releasedOn).getTime() - new Date(b.releasedOn).getTime()
    )
);

export const getReleasesByType = createSelector(
  getReleasesAsArray,
  releases =>
    releases.reduce(
      (acc: Record<TYPE, IRelease[]>, curr) => {
        if (!acc[curr.type]) {
          acc[curr.type] = [];
        }

        acc[curr.type].push(curr);

        return acc;
      },
      {} as any
    )
);

export const getSortedReleasesByType = createSelector(
  getReleasesByType,
  releases => ({
    [TYPE.ALBUM]: releases[TYPE.ALBUM],
    [TYPE.EP]: releases[TYPE.EP],
    [TYPE.SINGLE]: releases[TYPE.SINGLE],
    [TYPE.REMIX]: releases[TYPE.REMIX]
  })
);

export const getCurrentReleaseSlug = (state: TStoreState) =>
  state.releases.currentSlug;

export const getCurrentRelease = createSelector(
  getReleases,
  getCurrentReleaseSlug,
  (releases, slug) => (slug ? releases[slug] : undefined)
);

export const getReleasesLastEvaluatedKey = (state: TStoreState) =>
  state.releases.lastEvaluatedKey;

export const getReleasesLastEvaluatedKeyAsString = createSelector(
  getReleasesLastEvaluatedKey,
  lastEvaluatedKey =>
    !lastEvaluatedKey
      ? undefined
      : btoa(
          encodeURIComponent(
            JSON.stringify({
              IsActive: lastEvaluatedKey.isActive,
              ReleasedOn: lastEvaluatedKey.releasedOn,
              Slug: lastEvaluatedKey.slug
            })
          )
        )
);

export const getHasAllReleases = (state: TStoreState) =>
  state.releases.hasAllItems;

export const getReleasesIsLoading = (state: TStoreState) =>
  state.releases.isLoading;
