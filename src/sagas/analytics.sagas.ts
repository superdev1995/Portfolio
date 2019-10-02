import { SagaIterator } from "redux-saga";
import { call, takeLatest } from "redux-saga/effects";

import * as actions from "../actions/root.actions";
import { IPorts } from "../services/configurePorts";

export const trackAnalyticsEventSaga = (ports: IPorts) =>
  function*(): SagaIterator {
    yield takeLatest(actions.trackEvent, function*(action): SagaIterator {
      yield call(ports.dataLayer.push.bind(ports.dataLayer), action.payload);
    });
  };
