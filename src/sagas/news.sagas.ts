import { SagaIterator } from "redux-saga";
import { call, put, select, takeLatest } from "redux-saga/effects";

import { IPorts } from "../services/configurePorts";

import * as actions from "../actions/root.actions";
import * as selectors from "../selectors/root.selectors";

export const fetchLatestNewsSaga = (ports: IPorts) =>
  function*(): SagaIterator {
    yield takeLatest(
      actions.fetchLatestNews.started,
      function*(): SagaIterator {
        const response = yield call(ports.api.fetchNewsArticles, 5);

        if (response.ok) {
          yield put(
            actions.fetchLatestNews.done({
              params: {},
              result: response.data
            })
          );
        } else {
          yield put(
            actions.fetchLatestNews.failed({
              error: response.message,
              params: {}
            })
          );
        }
      }
    );
  };

export const fetchMoreLatestNewsSaga = (ports: IPorts) =>
  function*(): SagaIterator {
    yield takeLatest(
      actions.fetchMoreLatestNews.started,
      function*(): SagaIterator {
        const lastEvaluatedKey: string = yield select(
          selectors.getNewsLastEvaluatedKeyAsString
        );

        const response = yield call(
          ports.api.fetchNewsArticles,
          5,
          lastEvaluatedKey
        );

        if (response.ok) {
          yield put(
            actions.fetchMoreLatestNews.done({
              params: {},
              result: response.data
            })
          );

          const itemCount: number = yield select(
            selectors.getNewsArticlesCount
          );
          yield put(
            actions.trackEvent({
              event: "news.fetchedMore",
              itemCount
            })
          );
        } else {
          yield put(
            actions.fetchMoreLatestNews.failed({
              error: response.message,
              params: {}
            })
          );
        }
      }
    );
  };

export const fetchNewsArticleBySlugSaga = (ports: IPorts) =>
  function*(): SagaIterator {
    yield takeLatest(actions.fetchNewsArticleBySlug.started, function*({
      payload
    }): SagaIterator {
      const response = yield call(ports.api.fetchNewsArticleBySlug, payload);

      if (response.ok) {
        yield put(
          actions.fetchNewsArticleBySlug.done({
            params: payload,
            result: response.data
          })
        );
      } else {
        yield put(
          actions.fetchNewsArticleBySlug.failed({
            error: response.message,
            params: payload
          })
        );
      }
    });
  };
