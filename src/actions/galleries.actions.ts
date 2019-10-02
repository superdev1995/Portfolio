import actionCreatorFactory from "typescript-fsa";

import { IGallery, IS3Response } from "../models/root.models";

const createAction = actionCreatorFactory("GALLERIES");

export const fetchGalleries = createAction.async<{}, IS3Response<IGallery>>(
  "FETCH"
);

export const fetchMoreGalleries = createAction.async<{}, IS3Response<IGallery>>(
  "FETCH_MORE"
);

export const fetchGalleryBySlug = createAction.async<string, IGallery>(
  "FETCH_BY_SLUG"
);

export const setCurrentGallerySlug = createAction<string>("SET_CURRENT_SLUG");
