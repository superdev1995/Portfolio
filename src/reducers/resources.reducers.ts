import { reducerWithInitialState } from "typescript-fsa-reducers";

import * as actions from "../actions/root.actions";
import { IResource, TLastEvaluatedKey } from "../models/root.models";

export interface IState {
  hasAllItems: boolean;
  hasError: boolean;
  isLoading: boolean;
  items: Record<string, IResource>;
  lastEvaluatedKey?: TLastEvaluatedKey<"createdAt">;
}

export const initialState: IState = {
  hasAllItems: false,
  hasError: false,
  isLoading: false,
  items: {},
  lastEvaluatedKey: undefined
};

export default reducerWithInitialState(initialState)
  .cases(
    [actions.fetchResources.failed, actions.fetchMoreResources.failed],
    state => ({
      ...state,
      hasError: true,
      isLoading: false
    })
  )

  .case(actions.fetchResources.started, state => ({
    ...state,
    hasError: false,
    isLoading: true,
    items: {}
  }))

  .case(actions.fetchResources.done, (state, { result }) => ({
    ...state,
    hasAllItems: !result.lastEvaluatedKey,
    isLoading: false,
    items: result.items,
    lastEvaluatedKey: result.lastEvaluatedKey
  }))

  .case(actions.fetchMoreResources.started, state => ({
    ...state,
    hasError: false,
    isLoading: true
  }))

  .case(actions.fetchMoreResources.done, (state, { result }) => ({
    ...state,
    hasAllItems: !result.lastEvaluatedKey,
    isLoading: false,
    items: {
      ...state.items,
      ...result.items
    },
    lastEvaluatedKey: result.lastEvaluatedKey
  }));
