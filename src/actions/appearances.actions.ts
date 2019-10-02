import actionCreatorFactory from "typescript-fsa";

import { IAppearance, IDynamoResponse, ILatLng } from "../models/root.models";

const createAction = actionCreatorFactory("APPEARANCES");

export const fetchAppearances = createAction.async<
  {},
  IDynamoResponse<IAppearance, "startingAt">
>("FETCH");

export const fetchMoreAppearances = createAction.async<
  {},
  IDynamoResponse<IAppearance, "startingAt">
>("FETCH_MORE");

export const fetchAppearanceBySlug = createAction.async<string, IAppearance>(
  "FETCH_BY_SLUG"
);

export const setCurrentAppearanceSlug = createAction<string>(
  "SET_CURRENT_SLUG"
);

export const geocodeCurrentAppearanceAddress = createAction.async<{}, ILatLng>(
  "GEOCODE_CURRENT_ADDRESS"
);
