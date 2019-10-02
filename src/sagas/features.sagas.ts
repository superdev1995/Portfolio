import { SagaIterator } from "redux-saga";
import { call, takeLatest } from "redux-saga/effects";

import { IPorts } from "../services/configurePorts";

import * as actions from "../actions/root.actions";

export const addFeaturesSaga = (ports: IPorts) =>
  function*(): SagaIterator {
    yield takeLatest(actions.addFeatures, function*(action): SagaIterator {
      const featuresToAdd =
        typeof action.payload === "string" ? [action.payload] : action.payload;

      yield call(
        ports.features.push.bind(
          ports.features,
          ...featuresToAdd.filter(item => !ports.features.includes(item))
        )
      );
    });
  };

export const removeFeaturesSaga = (ports: IPorts) =>
  function*(): SagaIterator {
    yield takeLatest(actions.removeFeatures, function*(action): SagaIterator {
      const featuresToRemove =
        typeof action.payload === "string" ? [action.payload] : action.payload;

      for (const feature of featuresToRemove) {
        yield call(
          ports.features.splice.bind(ports.features),
          ports.features.indexOf(feature),
          1
        );
      }
    });
  };
