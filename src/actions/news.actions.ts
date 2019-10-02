import actionCreatorFactory from "typescript-fsa";

import { IDynamoResponse, INewsArticle } from "../models/root.models";

const createAction = actionCreatorFactory("NEWS");

export const fetchLatestNews = createAction.async<
  {},
  IDynamoResponse<INewsArticle, "createdAt">
>("FETCH");

export const fetchMoreLatestNews = createAction.async<
  {},
  IDynamoResponse<INewsArticle, "createdAt">
>("FETCH_MORE");

export const fetchNewsArticleBySlug = createAction.async<string, INewsArticle>(
  "FETCH_BY_SLUG"
);

export const setCurrentNewsArticleSlug = createAction<string>(
  "SET_CURRENT_SLUG"
);
