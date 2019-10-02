import { appearance, dynamoResponse } from "../models/root.models";
import { mockWithFailure, mockWithSuccess } from "../utilities/mocks";
import SagaTester from "../utilities/SagaTester";

import * as actions from "../actions/root.actions";

describe("[sagas] Appearances", () => {
  const item = appearance({
    location: {
      address: "123 Test Street",
      name: "Test venue"
    },
    slug: "item-1"
  });
  const data = dynamoResponse({
    items: [item]
  });

  describe("fetchAppearancesSaga", () => {
    describe("when fetching appearances, with a successful response", () => {
      const saga = new SagaTester(
        {},
        {
          api: {
            fetchAppearances: mockWithSuccess(data)
          }
        }
      );

      it("dispatches actions.fetchAppearances.started", () => {
        saga.dispatch(actions.fetchAppearances.started({}));
      });

      it("makes a single API request", () => {
        expect(saga.ports.api.fetchAppearances).toHaveBeenCalledTimes(1);
      });

      it("dispatches actions.fetchAppearances.done with the expected result", () => {
        const matchingActions = saga.history.filter(
          actions.fetchAppearances.done.match
        );

        expect(matchingActions).toHaveLength(1);
        expect(matchingActions[0].payload.result).toEqual(data);
      });
    });

    describe("when fetching appearances, with a failed response", () => {
      const saga = new SagaTester(
        {},
        {
          api: {
            fetchAppearances: mockWithFailure("Bad request")
          }
        }
      );

      it("dispatches actions.fetchAppearances.started", () => {
        saga.dispatch(actions.fetchAppearances.started({}));
      });

      it("makes a single API request", () => {
        expect(saga.ports.api.fetchAppearances).toHaveBeenCalledTimes(1);
      });

      it("dispatches actions.fetchAppearances.failed with expected error", () => {
        const matchingActions = saga.history.filter(
          actions.fetchAppearances.failed.match
        );

        expect(matchingActions).toHaveLength(1);
        expect(matchingActions[0].payload.error).toBe("Bad request");
      });
    });
  });

  describe("fetchMoreAppearancesSaga", () => {
    describe("when fetching more appearances, with a successful response", () => {
      const saga = new SagaTester(
        {
          appearances: {
            items: {
              "existing-item": {
                ...item,
                slug: "existing-item"
              }
            },
            lastEvaluatedKey: {
              isActive: "y",
              slug: "existing-item",
              startingAt: "2019-01-01T00:00:00"
            }
          }
        },
        {
          api: {
            fetchAppearances: mockWithSuccess(data)
          }
        }
      );

      it("dispatches actions.fetchMoreAppearances.started", () => {
        saga.dispatch(actions.fetchMoreAppearances.started({}));
      });

      it("makes a single API request", () => {
        expect(saga.ports.api.fetchAppearances).toHaveBeenCalledTimes(1);
      });

      it("dispatches actions.fetchMoreAppearances.done with expected result", () => {
        const matchingActions = saga.history.filter(
          actions.fetchMoreAppearances.done.match
        );

        expect(matchingActions).toHaveLength(1);
        expect(matchingActions[0].payload.result).toEqual(data);
      });

      it("dispatches actions.trackEvent with expected payload", () => {
        const matchingActions = saga.history.filter(actions.trackEvent.match);

        expect(matchingActions).toHaveLength(1);
        expect(matchingActions[0].payload).toEqual({
          event: "appearances.fetchedMore",
          itemCount: 2
        });
      });
    });

    describe("when fetching more appearances, with a failed response", () => {
      const saga = new SagaTester(
        {},
        {
          api: {
            fetchAppearances: mockWithFailure("Bad request")
          }
        }
      );

      it("dispatches actions.fetchMoreAppearances.started", () => {
        saga.dispatch(actions.fetchMoreAppearances.started({}));
      });

      it("makes a single API request", () => {
        expect(saga.ports.api.fetchAppearances).toHaveBeenCalledTimes(1);
      });

      it("dispatches actions.fetchMoreAppearances.failed with expected error", () => {
        const matchingActions = saga.history.filter(
          actions.fetchMoreAppearances.failed.match
        );

        expect(matchingActions).toHaveLength(1);
        expect(matchingActions[0].payload.error).toBe("Bad request");
      });
    });
  });

  describe("fetchAppearanceBySlugSaga", () => {
    describe("when fetching an appearance by slug, with a successful response", () => {
      const saga = new SagaTester(
        {},
        {
          api: {
            fetchAppearanceBySlug: mockWithSuccess(item)
          }
        }
      );

      it("dispatches actions.fetchAppearanceBySlug.started", () => {
        saga.dispatch(actions.fetchAppearanceBySlug.started(item.slug));
      });

      it("makes a single API request", () => {
        expect(saga.ports.api.fetchAppearanceBySlug).toHaveBeenCalledTimes(1);
      });

      it("dispatches actions.fetchAppearanceBySlug.done with expected result", () => {
        const matchingActions = saga.history.filter(
          actions.fetchAppearanceBySlug.done.match
        );

        expect(matchingActions).toHaveLength(1);
        expect(matchingActions[0].payload.result).toEqual(item);
      });
    });

    describe("when fetching an appearance by slug, with a failed response", () => {
      const saga = new SagaTester(
        {},
        {
          api: {
            fetchAppearanceBySlug: mockWithFailure("Bad request")
          }
        }
      );

      it("dispatches actions.fetchAppearanceBySlug.started", () => {
        saga.dispatch(actions.fetchAppearanceBySlug.started(item.slug));
      });

      it("makes a single API request", () => {
        expect(saga.ports.api.fetchAppearanceBySlug).toHaveBeenCalledTimes(1);
      });

      it("dispatches actions.fetchAppearanceBySlug.failed with expected error", () => {
        const matchingActions = saga.history.filter(
          actions.fetchAppearanceBySlug.failed.match
        );

        expect(matchingActions).toHaveLength(1);
        expect(matchingActions[0].payload.error).toBe("Bad request");
      });
    });
  });

  describe("geocodeCurrentAppearanceAddressSaga", () => {
    describe("when geocoding the current appearance's address, when its location.latLng is defined", () => {
      beforeAll(() => {
        jest.clearAllMocks();
      });

      const saga = new SagaTester(
        {
          appearances: {
            currentSlug: item.slug,
            items: {
              [item.slug]: {
                ...item,
                location: {
                  ...item.location,
                  latLng: { lat: 0, lng: 0 }
                }
              }
            }
          }
        },
        {
          maps: {
            Geocoder: jest.fn()
          }
        }
      );

      it("dispatches actions.geocodeCurrentAppearanceAddress.started", () => {
        saga.dispatch(actions.geocodeCurrentAppearanceAddress.started({}));
      });

      it("doesn't make a request to the geocoder API", () => {
        expect(saga.ports.maps.Geocoder).toHaveBeenCalledTimes(0);
      });

      it("dispatches actions.geocodeCurrentAppearanceAddress.done with expected result", () => {
        const matchingActions = saga.history.filter(
          actions.geocodeCurrentAppearanceAddress.done.match
        );

        expect(matchingActions).toHaveLength(1);
        expect(matchingActions[0].payload.result).toEqual({ lat: 0, lng: 0 });
      });
    });

    describe("when geocoding the current appearance's address, when its location.latLng isn't defined", () => {
      beforeAll(() => {
        jest.clearAllMocks();
      });

      const saga = new SagaTester(
        {
          appearances: {
            currentSlug: item.slug,
            items: {
              [item.slug]: item
            }
          }
        },
        {
          maps: {
            Geocoder: jest.fn(() => ({
              geocode: (_: any, callback: any) =>
                callback(
                  [
                    {
                      geometry: {
                        location: { lat: () => 51.54057, lng: () => -0.14334 }
                      }
                    }
                  ],
                  "OK"
                )
            }))
          }
        }
      );

      it("dispatches actions.geocodeCurrentAppearanceAddress.started", () => {
        saga.dispatch(actions.geocodeCurrentAppearanceAddress.started({}));
      });

      it("makes a single API request", () => {
        expect(saga.ports.maps.Geocoder).toHaveBeenCalledTimes(1);
      });

      it("dispatches actions.geocodeCurrentAppearanceAddress.done with expected result", () => {
        const matchingActions = saga.history.filter(
          actions.geocodeCurrentAppearanceAddress.done.match
        );

        expect(matchingActions).toHaveLength(1);
        expect(matchingActions[0].payload.result).toEqual({
          lat: 51.54057,
          lng: -0.14334
        });
      });
    });

    describe("when geocoding the current appearance's address, with a geocoder error", () => {
      jest.clearAllMocks();

      const saga = new SagaTester(
        {
          appearances: {
            currentSlug: item.slug,
            items: {
              [item.slug]: item
            }
          }
        },
        {
          maps: {
            Geocoder: jest.fn(() => ({
              geocode: (_: any, callback: any) => callback([], "REQUEST_DENIED")
            }))
          }
        }
      );

      it("dispatches actions.geocodeCurrentAppearanceAddress.started", () => {
        saga.dispatch(actions.geocodeCurrentAppearanceAddress.started({}));
      });

      it("makes a single API request", () => {
        expect(saga.ports.maps.Geocoder).toHaveBeenCalledTimes(1);
      });

      it("dispatches actions.geocodeCurrentAppearanceAddress.failed with expected error", () => {
        const matchingActions = saga.history.filter(
          actions.geocodeCurrentAppearanceAddress.failed.match
        );

        expect(matchingActions).toHaveLength(1);
        expect(matchingActions[0].payload.error).toBe(
          "Geocoder error: REQUEST_DENIED"
        );
      });
    });

    describe("when geocoding the current appearance's address, with a rejected geocoder promise", () => {
      jest.clearAllMocks();

      const saga = new SagaTester(
        {
          appearances: {
            currentSlug: item.slug,
            items: {
              [item.slug]: item
            }
          }
        },
        {
          maps: {
            Geocoder: jest.fn(() => ({
              geocode: () => {
                throw new Error("Failed promise");
              }
            }))
          }
        }
      );

      it("dispatches actions.geocodeCurrentAppearanceAddress.started", () => {
        saga.dispatch(actions.geocodeCurrentAppearanceAddress.started({}));
      });

      it("makes a request to the geocoder API", () => {
        expect(saga.ports.maps.Geocoder).toHaveBeenCalledTimes(1);
      });

      it("dispatches actions.geocodeCurrentAppearanceAddress.failed with expected error", () => {
        const matchingActions = saga.history.filter(
          actions.geocodeCurrentAppearanceAddress.failed.match
        );

        expect(matchingActions).toHaveLength(1);
        expect(matchingActions[0].payload.error).toBe("Failed promise");
      });
    });
  });
});
