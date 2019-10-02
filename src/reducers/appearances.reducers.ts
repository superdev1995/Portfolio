import { reducerWithInitialState } from "typescript-fsa-reducers";

import * as actions from "../actions/root.actions";
import { IAppearance, ILatLng, TLastEvaluatedKey } from "../models/root.models";

export interface IState {
  currentLocation?: ILatLng;
  currentSlug?: string;
  hasError: boolean;
  hasAllItems: boolean;
  isLoading: boolean;
  items: Record<string, IAppearance>;
  lastEvaluatedKey?: TLastEvaluatedKey<"startingAt">;
}

export const initialState: IState = {
  currentLocation: undefined,
  currentSlug: undefined,
  hasAllItems: false,
  hasError: false,
  isLoading: false,
  items: {},
  lastEvaluatedKey: undefined
};

export default reducerWithInitialState(initialState)
  .cases(
    [
      actions.fetchAppearances.failed,
      actions.fetchMoreAppearances.failed,
      actions.fetchAppearanceBySlug.failed
    ],
    state => ({
      ...state,
      hasError: true,
      isLoading: false
    })
  )

  .case(actions.fetchAppearances.started, state => ({
    ...state,
    hasError: false,
    isLoading: true,
    items: initialState.items
  }))

  .case(actions.fetchAppearances.done, (state, { result }) => ({
    ...state,
    hasAllItems: !result.lastEvaluatedKey,
    isLoading: false,
    items: result.items,
    lastEvaluatedKey: result.lastEvaluatedKey
  }))

  .cases(
    [
      actions.fetchMoreAppearances.started,
      actions.fetchAppearanceBySlug.started
    ],
    state => ({
      ...state,
      hasError: false,
      isLoading: true
    })
  )

  .case(actions.fetchMoreAppearances.done, (state, { result }) => ({
    ...state,
    hasAllItems: !result.lastEvaluatedKey,
    isLoading: false,
    items: {
      ...state.items,
      ...result.items
    },
    lastEvaluatedKey: result.lastEvaluatedKey
  }))

  .case(actions.setCurrentAppearanceSlug, (state, payload) => ({
    ...state,
    currentLocation: undefined,
    currentSlug: payload
  }))

  .case(actions.fetchAppearanceBySlug.done, (state, { result }) => ({
    ...state,
    isLoading: false,
    items: {
      ...state.items,
      [result.slug]: result
    }
  }))

  .case(actions.geocodeCurrentAppearanceAddress.started, state => ({
    ...state,
    currentLocation: undefined
  }))

  .case(actions.geocodeCurrentAppearanceAddress.done, (state, { result }) => ({
    ...state,
    currentLocation: result
  }));
