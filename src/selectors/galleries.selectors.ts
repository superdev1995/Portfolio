import { createSelector, defaultMemoize } from "reselect";

import { TStoreState } from "../reducers/root.reducers";

export const hasGalleriesError = (state: TStoreState) =>
  state.galleries.hasError;

export const getGalleries = defaultMemoize(
  (state: TStoreState) => state.galleries.items
);

export const getGalleriesCount = createSelector(
  getGalleries,
  galleries => Object.keys(galleries).length
);

export const getGalleriesAsArray = createSelector(
  getGalleries,
  galleries =>
    Object.values(galleries).sort(
      (a, b) =>
        new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime()
    )
);

export const getCurrentGallerySlug = (state: TStoreState) =>
  state.galleries.currentSlug;

export const getCurrentGallery = createSelector(
  getGalleries,
  getCurrentGallerySlug,
  (galleries, slug) => (slug ? galleries[slug] : undefined)
);

export const getGalleriesLastKey = createSelector(
  getGalleries,
  getGalleriesCount,
  (galleries, galleriesCount) => Object.keys(galleries)[galleriesCount - 1]
);

export const getHasAllGalleries = (state: TStoreState) =>
  state.galleries.hasAllItems;

export const getGalleriesIsLoading = (state: TStoreState) =>
  state.galleries.isLoading;
