import actionCreatorFactory from "typescript-fsa";

const createAction = actionCreatorFactory("ANALYTICS");

export const trackEvent = createAction<{
  event: string;
  [index: string]: any;
}>("TRACK_EVENT");
