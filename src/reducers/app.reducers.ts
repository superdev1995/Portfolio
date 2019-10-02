import { reducerWithInitialState } from "typescript-fsa-reducers";

import * as actions from "../actions/root.actions";
import { error, IError } from "../models/root.models";

export interface IState {
  currentRoute?: string;
  error?: IError;
  hasNewVersion: boolean;
  isLoading: boolean;
  isNavOpen: boolean;
  isOnline: boolean;
  transitioningTo?: string;
}

export const initialState: IState = {
  currentRoute: undefined,
  error: undefined,
  hasNewVersion: false,
  isLoading: false,
  isNavOpen: false,
  isOnline: true,
  transitioningTo: undefined
};

export default reducerWithInitialState(initialState)
  .case(actions.setOnlineStatus, (state, payload) => ({
    ...state,
    isOnline: payload
  }))

  .case(actions.setHasNewVersion, (state, payload) => ({
    ...state,
    hasNewVersion: payload
  }))

  .case(actions.toggleNavigation, state => ({
    ...state,
    isNavOpen: !state.isNavOpen
  }))

  .case(actions.setCurrentRoute, (state, payload) => ({
    ...state,
    currentRoute: payload
  }))

  .case(actions.changeRoute.started, (state, payload) => ({
    ...state,
    error: undefined,
    isLoading: true,
    isNavOpen: false,
    transitioningTo: payload
  }))

  .case(actions.changeRoute.done, (state, { params }) => ({
    ...state,
    currentRoute: params,
    isLoading: false,
    transitioningTo: undefined
  }))

  .case(actions.changeRoute.failed, (state, payload) => ({
    ...state,
    error: error(payload.error),
    isLoading: false,
    transitioningTo: undefined
  }))

  .cases(
    [
      actions.fetchAppearanceBySlug.failed,
      actions.fetchGalleryBySlug.failed,
      actions.fetchNewsArticleBySlug.failed,
      actions.fetchReleaseBySlug.failed
    ],
    state => ({
      ...state,
      error: error({
        status: 404
      })
    })
  );
