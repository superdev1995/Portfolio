import { combineReducers } from "redux";

import app, { initialState as appIS } from "./app.reducers";
import appearances, {
  initialState as appearancesIS
} from "./appearances.reducers";
import features, { initialState as featuresIS } from "./features.reducers";
import galleries, { initialState as galleriesIS } from "./galleries.reducers";
import intl, { initialState as intlIS } from "./intl.reducers";
import news, { initialState as newsIS } from "./news.reducers";
import releases, { initialState as releasesIS } from "./releases.reducers";
import resources, { initialState as resourcesIS } from "./resources.reducers";
import stems, { initialState as stemsIS } from "./stems.reducers";

export const initialState = {
  app: appIS,
  appearances: appearancesIS,
  features: featuresIS,
  galleries: galleriesIS,
  intl: intlIS,
  news: newsIS,
  releases: releasesIS,
  resources: resourcesIS,
  stems: stemsIS
};

const rootReducer = combineReducers({
  app,
  appearances,
  features,
  galleries,
  intl,
  news,
  releases,
  resources,
  stems
});

export default rootReducer;

export type TStoreState = typeof initialState;
