import { SagaIterator } from "redux-saga";
import { all, fork, ForkEffect } from "redux-saga/effects";

import { IPorts } from "../services/configurePorts";

import * as analytics from "./analytics.sagas";
import * as appearances from "./appearances.sagas";
import * as features from "./features.sagas";
import * as galleries from "./galleries.sagas";
import * as news from "./news.sagas";
import * as releases from "./releases.sagas";
import * as resources from "./resources.sagas";
import * as serviceWorker from "./serviceWorker.sagas";
import * as stems from "./stems.sagas";

const allSagas = {
  ...analytics,
  ...appearances,
  ...features,
  ...galleries,
  ...news,
  ...releases,
  ...resources,
  ...serviceWorker,
  ...stems
};

const mapSagas = (ports: IPorts) => {
  const mapped: ForkEffect[] = [];

  for (const saga of Object.values(allSagas)) {
    mapped.push(fork(saga(ports)));
  }

  return mapped;
};

export default function*(ports: IPorts): SagaIterator {
  yield all(mapSagas(ports));
}
