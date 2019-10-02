import { SagaIterator } from "redux-saga";
import { call, put, select, takeLatest } from "redux-saga/effects";

import { IPorts } from "../services/configurePorts";

import * as actions from "../actions/root.actions";
import * as selectors from "../selectors/root.selectors";

export const fetchResourcesSaga = (ports: IPorts) =>
  function*(): SagaIterator {
    yield takeLatest(actions.fetchResources.started, function*(): SagaIterator {
      const response = yield call(ports.api.fetchResources);

      if (response.ok) {
        yield put(
          actions.fetchResources.done({
            params: {},
            result: response.data
          })
        );
      } else {
        yield put(
          actions.fetchResources.failed({ error: response.message, params: {} })
        );
      }
    });
  };

export const fetchMoreResourcesSaga = (ports: IPorts) =>
  function*(): SagaIterator {
    yield takeLatest(
      actions.fetchMoreResources.started,
      function*(): SagaIterator {
        const lastEvaluatedKey: string = yield select(
          selectors.getResourcesLastEvaluatedKeyAsString
        );
        const response = yield call(
          ports.api.fetchResources,
          undefined,
          lastEvaluatedKey
        );

        if (response.ok) {
          yield put(
            actions.fetchMoreResources.done({
              params: {},
              result: response.data
            })
          );

          const itemCount: number = yield select(selectors.getResourcesCount);
          yield put(
            actions.trackEvent({
              event: "resources.fetchedMore",
              itemCount
            })
          );
        } else {
          yield put(
            actions.fetchMoreResources.failed({
              error: response.message,
              params: {}
            })
          );
        }
      }
    );
  };
