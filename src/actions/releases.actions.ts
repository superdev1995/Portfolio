import actionCreatorFactory from "typescript-fsa";

import { IDynamoResponse, IRelease } from "../models/root.models";

const createAction = actionCreatorFactory("RELEASES");

export const fetchReleases = createAction.async<
  {},
  IDynamoResponse<IRelease, "releasedOn">
>("FETCH");

export const fetchMoreReleases = createAction.async<
  {},
  IDynamoResponse<IRelease, "releasedOn">
>("FETCH_MORE");

export const fetchReleaseBySlug = createAction.async<string, IRelease>(
  "FETCH_BY_SLUG"
);

export const setCurrentReleaseSlug = createAction<string>("SET_CURRENT_SLUG");
