import { SagaIterator } from "redux-saga";
import { call, put, select, takeLatest } from "redux-saga/effects";

import { IPorts } from "../services/configurePorts";

import * as actions from "../actions/root.actions";
import * as selectors from "../selectors/root.selectors";

export const fetchReleasesSaga = (ports: IPorts) =>
  function*(): SagaIterator {
    yield takeLatest(actions.fetchReleases.started, function*(): SagaIterator {
      const response = yield call(ports.api.fetchReleases);

      if (response.ok) {
        yield put(
          actions.fetchReleases.done({
            params: {},
            result: response.data
          })
        );
      } else {
        yield put(
          actions.fetchReleases.failed({ error: response.message, params: {} })
        );
      }
    });
  };

export const fetchMoreReleasesSaga = (ports: IPorts) =>
  function*(): SagaIterator {
    yield takeLatest(
      actions.fetchMoreReleases.started,
      function*(): SagaIterator {
        const lastEvaluatedKey = yield select(
          selectors.getReleasesLastEvaluatedKeyAsString
        );
        const response = yield call(
          ports.api.fetchReleases,
          undefined,
          lastEvaluatedKey
        );

        if (response.ok) {
          yield put(
            actions.fetchMoreReleases.done({
              params: {},
              result: response.data
            })
          );

          const itemCount = yield select(selectors.getReleasesCount);
          yield put(
            actions.trackEvent({
              event: "releases.fetchedMore",
              itemCount
            })
          );
        } else {
          yield put(
            actions.fetchMoreReleases.failed({
              error: response.message,
              params: {}
            })
          );
        }
      }
    );
  };

export const fetchReleaseBySlugSaga = (ports: IPorts) =>
  function*(): SagaIterator {
    yield takeLatest(actions.fetchReleaseBySlug.started, function*({
      payload
    }): SagaIterator {
      const response = yield call(ports.api.fetchReleaseBySlug, payload);

      if (response.ok) {
        yield put(
          actions.fetchReleaseBySlug.done({
            params: payload,
            result: response.data
          })
        );
      } else {
        yield put(
          actions.fetchReleaseBySlug.failed({
            error: response.message,
            params: payload
          })
        );
      }
    });
  };
