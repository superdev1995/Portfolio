import { SagaIterator } from "redux-saga";
import { call, put, select, takeLatest } from "redux-saga/effects";

import { IPorts } from "../services/configurePorts";

import * as actions from "../actions/root.actions";
import * as selectors from "../selectors/root.selectors";

export const fetchStemsSaga = (ports: IPorts) =>
  function*(): SagaIterator {
    yield takeLatest(actions.fetchStems.started, function*(): SagaIterator {
      const response = yield call(ports.api.fetchStems);

      if (response.ok) {
        yield put(
          actions.fetchStems.done({
            params: {},
            result: response.data
          })
        );
      } else {
        yield put(
          actions.fetchStems.failed({ error: response.message, params: {} })
        );
      }
    });
  };

export const fetchMoreStemsSaga = (ports: IPorts) =>
  function*(): SagaIterator {
    yield takeLatest(actions.fetchMoreStems.started, function*(): SagaIterator {
      const lastEvaluatedKey: string = yield select(
        selectors.getStemsLastEvaluatedKeyAsString
      );
      const response = yield call(
        ports.api.fetchStems,
        undefined,
        lastEvaluatedKey
      );

      if (response.ok) {
        yield put(
          actions.fetchMoreStems.done({
            params: {},
            result: response.data
          })
        );

        const itemCount: number = yield select(selectors.getStemsCount);
        yield put(
          actions.trackEvent({
            event: "stems.fetchedMore",
            itemCount
          })
        );
      } else {
        yield put(
          actions.fetchMoreStems.failed({
            error: response.message,
            params: {}
          })
        );
      }
    });
  };
