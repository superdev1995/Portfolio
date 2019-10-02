import { reducerWithInitialState } from "typescript-fsa-reducers";

import * as actions from "../actions/root.actions";
import { INewsArticle, TLastEvaluatedKey } from "../models/root.models";

interface IState {
  currentSlug?: string;
  hasAllItems: boolean;
  hasError: boolean;
  isLoading: boolean;
  items: Record<string, INewsArticle>;
  lastEvaluatedKey?: TLastEvaluatedKey<"createdAt">;
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
      actions.fetchLatestNews.failed,
      actions.fetchMoreLatestNews.failed,
      actions.fetchNewsArticleBySlug.failed
    ],
    state => ({
      ...state,
      hasError: true,
      isLoading: false
    })
  )

  .case(actions.fetchLatestNews.started, state => ({
    ...state,
    hasError: false,
    isLoading: true,
    items: {}
  }))

  .case(actions.fetchLatestNews.done, (state, { result }) => ({
    ...state,
    hasAllItems: !result.lastEvaluatedKey,
    isLoading: false,
    items: result.items,
    lastEvaluatedKey: result.lastEvaluatedKey
  }))

  .case(actions.fetchMoreLatestNews.started, state => ({
    ...state,
    hasError: false,
    isLoading: true
  }))

  .case(actions.fetchMoreLatestNews.done, (state, { result }) => ({
    ...state,
    hasAllItems: !result.lastEvaluatedKey,
    isLoading: false,
    items: {
      ...state.items,
      ...result.items
    },
    lastEvaluatedKey: result.lastEvaluatedKey
  }))

  .case(actions.setCurrentNewsArticleSlug, (state, payload) => ({
    ...state,
    currentSlug: payload
  }))

  .case(actions.fetchNewsArticleBySlug.started, state => ({
    ...state,
    hasError: false,
    isLoading: true
  }))

  .case(actions.fetchNewsArticleBySlug.done, (state, { result }) => ({
    ...state,
    isLoading: false,
    items: {
      ...state.items,
      [result.slug]: result
    }
  }));
