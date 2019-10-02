import { TStoreState } from "../reducers/root.reducers";

export const getCurrentRoute = (state: TStoreState) => state.app.currentRoute;

export const getAppError = (state: TStoreState) => state.app.error;

export const isAppLoading = (state: TStoreState) => state.app.isLoading;

export const hasNewVersion = (state: TStoreState) => state.app.hasNewVersion;

export const isNavOpen = (state: TStoreState) => state.app.isNavOpen;

export const isOnline = (state: TStoreState) => state.app.isOnline;
