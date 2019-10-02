import { SagaIterator } from "redux-saga";
import { call, put, takeLatest } from "redux-saga/effects";

import * as actions from "../actions/root.actions";

export const cachePageOnTransitionSaga = () =>
  function*(): SagaIterator {
    yield takeLatest(actions.changeRoute.done, function*(action): SagaIterator {
      if ("serviceWorker" in navigator && navigator.serviceWorker) {
        const serviceWorker = navigator.serviceWorker.controller;

        if (serviceWorker && serviceWorker.state === "activated") {
          yield call(serviceWorker.postMessage.bind(serviceWorker), {
            payload: action.payload.params,
            type: "changeRoute"
          });
        }
      }
    });
  };

export const receiveServiceWorkerMessageSaga = () =>
  function*(): SagaIterator {
    yield takeLatest(actions.receiveServiceWorkerMessage, function*(
      action
    ): SagaIterator {
      switch (action.payload.type) {
        case "serviceWorker.activate":
          yield put(actions.setHasNewVersion(true));
          break;
      }
    });
  };
