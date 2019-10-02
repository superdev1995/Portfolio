import { TStoreState } from "../reducers/root.reducers";

export const getFeatures = (state: TStoreState) => state.features.items;

export const hasFeature = (state: TStoreState, feature: string) =>
  getFeatures(state).includes(feature);
