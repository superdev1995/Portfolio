import { reducerWithInitialState } from "typescript-fsa-reducers";

import * as actions from "../actions/root.actions";
import { IGallery } from "../models/root.models";

export interface IState {
  currentSlug?: string;
  hasAllItems: boolean;
  hasError: boolean;
  isLoading: boolean;
  items: Record<string, IGallery>;
}

export const initialState: IState = {
  currentSlug: undefined,
  hasAllItems: false,
  hasError: false,
  isLoading: false,
  items: {}
};

export default reducerWithInitialState(initialState)
  .cases(
    [
      actions.fetchGalleries.failed,
      actions.fetchMoreGalleries.failed,
      actions.fetchGalleryBySlug.failed
    ],
    state => ({
      ...state,
      hasError: true,
      isLoading: false
    })
  )

  .case(actions.fetchGalleries.started, state => ({
    ...state,
    hasError: false,
    isLoading: true,
    items: initialState.items
  }))

  .case(actions.fetchGalleries.done, (state, { result }) => ({
    ...state,
    hasAllItems: !result.isTruncated,
    isLoading: false,
    items: result.items
  }))

  .case(actions.fetchMoreGalleries.started, state => ({
    ...state,
    hasError: false,
    isLoading: true
  }))

  .case(actions.fetchMoreGalleries.done, (state, { result }) => ({
    ...state,
    hasAllItems: !result.isTruncated,
    isLoading: false,
    items: {
      ...state.items,
      ...result.items
    }
  }))

  .case(actions.setCurrentGallerySlug, (state, payload) => ({
    ...state,
    currentSlug: payload
  }))

  .case(actions.fetchGalleryBySlug.started, state => ({
    ...state,
    hasError: false,
    isLoading: true
  }))

  .case(actions.fetchGalleryBySlug.done, (state, { result }) => ({
    ...state,
    isLoading: false,
    items: {
      ...state.items,
      [result.slug]: result
    }
  }));
