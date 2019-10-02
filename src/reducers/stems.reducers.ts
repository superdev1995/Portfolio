import { reducerWithInitialState } from "typescript-fsa-reducers";

import * as actions from "../actions/root.actions";
import { IStem, TLastEvaluatedKey } from "../models/root.models";

export interface IState {
  hasAllItems: boolean;
  hasError: boolean;
  isLoading: boolean;
  items: Record<string, IStem>;
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
  .cases([actions.fetchStems.failed, actions.fetchMoreStems.failed], state => ({
    ...state,
    hasError: true,
    isLoading: false
  }))

  .case(actions.fetchStems.started, state => ({
    ...state,
    hasError: false,
    isLoading: true,
    items: {}
  }))

  .case(actions.fetchStems.done, (state, { result }) => ({
    ...state,
    hasAllItems: !result.lastEvaluatedKey,
    isLoading: false,
    items: result.items,
    lastEvaluatedKey: result.lastEvaluatedKey
  }))

  .case(actions.fetchMoreStems.started, state => ({
    ...state,
    hasError: false,
    isLoading: true
  }))

  .case(actions.fetchMoreStems.done, (state, { result }) => ({
    ...state,
    hasAllItems: !result.lastEvaluatedKey,
    isLoading: false,
    items: {
      ...state.items,
      ...result.items
    },
    lastEvaluatedKey: result.lastEvaluatedKey
  }));
