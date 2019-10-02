import { createSelector, defaultMemoize } from "reselect";

import { TStoreState } from "../reducers/root.reducers";

export const hasNewsError = (state: TStoreState) => state.news.hasError;

export const getNewsArticles = defaultMemoize(
  (state: TStoreState) => state.news.items
);

export const getNewsArticlesCount = createSelector(
  getNewsArticles,
  articles => Object.keys(articles).length
);

export const getNewsArticlesAsArray = createSelector(
  getNewsArticles,
  articles =>
    Object.values(articles).sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
);

export const getCurrentNewsArticleSlug = (state: TStoreState) =>
  state.news.currentSlug;

export const getCurrentNewsArticle = createSelector(
  getNewsArticles,
  getCurrentNewsArticleSlug,
  (articles, slug) => (slug ? articles[slug] : undefined)
);

export const getNewsLastEvaluatedKey = (state: TStoreState) =>
  state.news.lastEvaluatedKey;

export const getNewsLastEvaluatedKeyAsString = createSelector(
  getNewsLastEvaluatedKey,
  lastEvaluatedKey =>
    !lastEvaluatedKey
      ? undefined
      : btoa(
          encodeURIComponent(
            JSON.stringify({
              CreatedAt: lastEvaluatedKey.createdAt,
              IsActive: lastEvaluatedKey.isActive,
              Slug: lastEvaluatedKey.slug
            })
          )
        )
);

export const getHasAllNewsArticles = (state: TStoreState) =>
  state.news.hasAllItems;

export const getNewsIsLoading = (state: TStoreState) => state.news.isLoading;
