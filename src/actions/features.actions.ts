import actionCreatorFactory from "typescript-fsa";

const createAction = actionCreatorFactory("FEATURES");

export const addFeatures = createAction<string | string[]>("ADD");

export const removeFeatures = createAction<string | string[]>("REMOVE");
