import {
  applyMiddleware,
  compose,
  createStore as reduxStore,
  DeepPartial,
  Middleware,
  Store
} from "redux";
import createSagaMiddleware, { Task } from "redux-saga";

import { isServer } from "../helpers/dom";
import { configureApi } from "../services/configureApi";
import { configureHttpClient } from "../services/configureHttpClient";
import { configurePorts, IPorts } from "../services/configurePorts";

import rootReducer, { TStoreState } from "../reducers/root.reducers";
import rootSaga from "../sagas/root.sagas";

export type TStore = Store<TStoreState> & {
  sagaTask?: Task;
  runSagaTask?: () => void;
};

export const configureStore = (
  initialState: DeepPartial<TStoreState>,
  ports: IPorts,
  extraMiddlewares: Middleware[] = []
) => {
  // Environment
  const isDev = process.env.NODE_ENV === "development";

  // Middleware
  const sagaMiddleware = createSagaMiddleware();
  const middleware = [...extraMiddlewares, sagaMiddleware];

  // Redux devtools
  let composeEnhancers = compose;
  if (
    !isServer() &&
    isDev &&
    typeof window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ === "function"
  ) {
    composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
  }

  // Redux store
  const store: TStore = reduxStore(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(...middleware))
  );

  // Redux sagas
  store.runSagaTask = () => {
    store.sagaTask = sagaMiddleware.run(rootSaga, ports);
  };
  store.runSagaTask();

  return store;
};

export const createStore = (initialState: DeepPartial<TStoreState> = {}) => {
  const dataLayer = !isServer() ? window.dataLayer : [];
  const features = !isServer() ? window.features : [];
  const maps = !isServer() ? window.google.maps : undefined;

  const ports = configurePorts({
    api: configureApi(
      configureHttpClient({
        apiUrl: "https://api.mynameisviii.com"
      })
    ),
    dataLayer,
    features,
    maps
  });

  return configureStore(initialState, ports);
};
