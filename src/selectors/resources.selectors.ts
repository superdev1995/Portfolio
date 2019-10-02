import { createSelector, defaultMemoize } from "reselect";

import { TYPE } from "../constants/resource.constants";
import { IResource } from "../models/root.models";
import { TStoreState } from "../reducers/root.reducers";

export const hasResourcesError = (state: TStoreState) =>
  state.resources.hasError;

export const getResources = defaultMemoize(
  (state: TStoreState) => state.resources.items
);

export const getResourcesCount = createSelector(
  getResources,
  resources => Object.keys(resources).length
);

export const getResourcesAsArray = createSelector(
  getResources,
  resources =>
    Object.values(resources).sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
);

export const getResourcesByType = createSelector(
  getResourcesAsArray,
  resources =>
    resources.reduce(
      (acc: Record<TYPE, IResource[]>, curr) => {
        if (!acc[curr.type]) {
          acc[curr.type] = [];
        }

        acc[curr.type].push(curr);

        return acc;
      },
      {} as any
    )
);

export const getResourcesLastEvaluatedKey = (state: TStoreState) =>
  state.resources.lastEvaluatedKey;

export const getResourcesLastEvaluatedKeyAsString = createSelector(
  getResourcesLastEvaluatedKey,
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

export const getHasAllResources = (state: TStoreState) =>
  state.resources.hasAllItems;

export const getResourcesIsLoading = (state: TStoreState) =>
  state.resources.isLoading;
