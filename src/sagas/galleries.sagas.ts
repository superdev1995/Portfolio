import { SagaIterator } from "redux-saga";
import { call, put, select, takeLatest } from "redux-saga/effects";

import { IPorts } from "../services/configurePorts";

import * as actions from "../actions/root.actions";
import * as selectors from "../selectors/root.selectors";

export const fetchGalleriesSaga = (ports: IPorts) =>
  function*(): SagaIterator {
    yield takeLatest(actions.fetchGalleries.started, function*(): SagaIterator {
      const response = yield call(ports.api.fetchGalleries);

      if (response.ok) {
        yield put(
          actions.fetchGalleries.done({
            params: {},
            result: response.data
          })
        );
      } else {
        yield put(
          actions.fetchGalleries.failed({
            error: response.message,
            params: {}
          })
        );
      }
    });
  };

export const fetchMoreGalleriesSaga = (ports: IPorts) =>
  function*(): SagaIterator {
    yield takeLatest(
      actions.fetchMoreGalleries.started,
      function*(): SagaIterator {
        const lastKey: string = yield select(selectors.getGalleriesLastKey);

        const response = yield call(ports.api.fetchGalleries, lastKey);

        if (response.ok) {
          yield put(
            actions.fetchMoreGalleries.done({
              params: {},
              result: response.data
            })
          );

          const itemCount: number = yield select(selectors.getGalleriesCount);
          yield put(
            actions.trackEvent({
              event: "galleries.fetchedMore",
              itemCount
            })
          );
        } else {
          yield put(
            actions.fetchMoreGalleries.failed({
              error: response.message,
              params: {}
            })
          );
        }
      }
    );
  };

export const fetchGalleryBySlugSaga = (ports: IPorts) =>
  function*(): SagaIterator {
    yield takeLatest(actions.fetchGalleryBySlug.started, function*({
      payload
    }): SagaIterator {
      const response = yield call(ports.api.fetchGalleryBySlug, payload);

      if (response.ok) {
        yield put(
          actions.fetchGalleryBySlug.done({
            params: payload,
            result: response.data
          })
        );
      } else {
        yield put(
          actions.fetchGalleryBySlug.failed({
            error: response.message,
            params: payload
          })
        );
      }
    });
  };
