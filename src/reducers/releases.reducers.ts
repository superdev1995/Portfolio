import { reducerWithInitialState } from "typescript-fsa-reducers";

import * as actions from "../actions/root.actions";
import { IRelease, TLastEvaluatedKey } from "../models/root.models";

export interface IState {
  currentSlug?: string;
  hasAllItems: boolean;
  hasError: boolean;
  isLoading: boolean;
  items: Record<string, IRelease>;
  lastEvaluatedKey?: TLastEvaluatedKey<"releasedOn">;
}

export const initialState: IState = {
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
      actions.fetchReleases.failed,
      actions.fetchMoreReleases.failed,
      actions.fetchReleaseBySlug.failed
    ],
    state => ({
      ...state,
      hasError: true,
      isLoading: false
    })
  )

  .case(actions.fetchReleases.started, state => ({
    ...state,
    hasError: false,
    isLoading: true,
    items: {}
  }))

  .case(actions.fetchReleases.done, (state, { result }) => ({
    ...state,
    hasAllItems: !result.lastEvaluatedKey,
    isLoading: false,
    items: result.items,
    lastEvaluatedKey: result.lastEvaluatedKey
  }))

  .case(actions.fetchMoreReleases.started, state => ({
    ...state,
    hasError: false,
    isLoading: true
  }))

  .case(actions.fetchMoreReleases.done, (state, { result }) => ({
    ...state,
    hasAllItems: !result.lastEvaluatedKey,
    isLoading: false,
    items: {
      ...state.items,
      ...result.items
    },
    lastEvaluatedKey: result.lastEvaluatedKey
  }))

  .case(actions.setCurrentReleaseSlug, (state, payload) => ({
    ...state,
    currentSlug: payload
  }))

  .case(actions.fetchReleaseBySlug.started, state => ({
    ...state,
    hasError: false,
    isLoading: true
  }))

  .case(actions.fetchReleaseBySlug.done, (state, { result }) => ({
    ...state,
    isLoading: false,
    items: {
      ...state.items,
      [result.slug]: result
    }
  }));
