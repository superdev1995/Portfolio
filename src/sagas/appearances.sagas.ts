import { SagaIterator } from "redux-saga";
import { call, put, select, takeLatest } from "redux-saga/effects";

import { IPorts } from "../services/configurePorts";

import * as actions from "../actions/root.actions";
import * as selectors from "../selectors/root.selectors";

const geocode = (geocoder: any, params: any) =>
  new Promise((resolve, reject) => {
    try {
      geocoder.geocode(
        params,
        (response: IGeocoderResult[], status: string) => {
          resolve({ results: response, status });
        }
      );
    } catch (error) {
      reject(error);
    }
  });

export const fetchAppearancesSaga = (ports: IPorts) =>
  function*(): SagaIterator {
    yield takeLatest(
      actions.fetchAppearances.started,
      function*(): SagaIterator {
        const response = yield call(ports.api.fetchAppearances);

        if (response.ok) {
          yield put(
            actions.fetchAppearances.done({ params: {}, result: response.data })
          );
        } else {
          yield put(
            actions.fetchAppearances.failed({
              error: response.message,
              params: {}
            })
          );
        }
      }
    );
  };

export const fetchMoreAppearancesSaga = (ports: IPorts) =>
  function*(): SagaIterator {
    yield takeLatest(
      actions.fetchMoreAppearances.started,
      function*(): SagaIterator {
        const lastEvaluatedKey: string = yield select(
          selectors.getAppearancesLastEvaluatedKeyAsString
        );
        const response = yield call(
          ports.api.fetchAppearances,
          undefined,
          lastEvaluatedKey
        );

        if (response.ok) {
          yield put(
            actions.fetchMoreAppearances.done({
              params: {},
              result: response.data
            })
          );

          const itemCount: number = yield select(selectors.getAppearancesCount);
          yield put(
            actions.trackEvent({
              event: "appearances.fetchedMore",
              itemCount
            })
          );
        } else {
          yield put(
            actions.fetchMoreAppearances.failed({
              error: response.message,
              params: {}
            })
          );
        }
      }
    );
  };

export const fetchAppearanceBySlugSaga = (ports: IPorts) =>
  function*(): SagaIterator {
    yield takeLatest(actions.fetchAppearanceBySlug.started, function*({
      payload
    }): SagaIterator {
      const response = yield call(ports.api.fetchAppearanceBySlug, payload);

      if (response.ok) {
        yield put(
          actions.fetchAppearanceBySlug.done({
            params: payload,
            result: response.data
          })
        );
      } else {
        yield put(
          actions.fetchAppearanceBySlug.failed({
            error: response.message,
            params: payload
          })
        );
      }
    });
  };

export const geocodeCurrentAppearanceAddressSaga = (ports: IPorts) =>
  function*(): SagaIterator {
    yield takeLatest(
      actions.geocodeCurrentAppearanceAddress.started,
      function*(): SagaIterator {
        const currentAppearance = yield select(selectors.getCurrentAppearance);
        const { address, latLng, name } = currentAppearance.location;

        if (latLng) {
          yield put(
            actions.geocodeCurrentAppearanceAddress.done({
              params: {},
              result: latLng
            })
          );
        } else {
          try {
            const { results, status } = yield call(
              geocode,
              new ports.maps.Geocoder(),
              { address: `${name}, ${address}` }
            );

            if (status === ports.maps.GeocoderStatus.OK && results.length > 0) {
              const { location } = results[0].geometry;

              yield put(
                actions.geocodeCurrentAppearanceAddress.done({
                  params: {},
                  result: {
                    lat: location.lat(),
                    lng: location.lng()
                  }
                })
              );
            } else {
              yield put(
                actions.geocodeCurrentAppearanceAddress.failed({
                  error: `Geocoder error: ${status}`,
                  params: {}
                })
              );
            }
          } catch (error) {
            yield put(
              actions.geocodeCurrentAppearanceAddress.failed({
                error: error.message,
                params: {}
              })
            );
          }
        }
      }
    );
  };
