import actionCreatorFactory from "typescript-fsa";

const createAction = actionCreatorFactory("APP");

export const initApp = createAction.async<{ locale?: string }, {}>("INIT");

export const toggleNavigation = createAction("TOGGLE_NAVIGATION");

export const setOnlineStatus = createAction<boolean>("SET_ONLINE_STATUS");

export const setHasNewVersion = createAction<boolean>("SET_HAS_NEW_VERSION");

export const setCurrentRoute = createAction<string>("SET_CURRENT_ROUTE");

export const changeRoute = createAction.async<string, {}>("CHANGE_ROUTE");
