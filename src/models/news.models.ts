import dayjs from "dayjs";

import { BOOLEAN } from "../constants/api.constants";
import { TYPE } from "../constants/news.constants";

export interface INewsArticleAction {
  route?: string;
  url?: string;
  text: string;
}

export interface IRawNewsArticle {
  action?: INewsArticleAction;
  author?: string;
  content?: string;
  createdAt?: string;
  excerpt?: string;
  imageUrl?: string;
  isActive?: BOOLEAN;
  ogImageUrl?: string;
  slug?: string;
  title?: string;
  type?: TYPE;
}

export interface INewsArticle {
  readonly action?: INewsArticleAction;
  readonly author: string;
  readonly content: string;
  readonly createdAt: string;
  readonly excerpt: string;
  readonly imageUrl: string;
  readonly isActive: boolean;
  readonly ogImageUrl: string;
  readonly slug: string;
  readonly title: string;
  readonly type: TYPE;
}

export const newsArticle = (options: IRawNewsArticle = {}): INewsArticle => ({
  action: options.action,
  author: options.author || "",
  content: options.content || "",
  createdAt: options.createdAt || dayjs().toISOString(),
  excerpt: options.excerpt || "",
  imageUrl: options.imageUrl || "",
  isActive: (options.isActive && options.isActive === BOOLEAN.TRUE) || false,
  ogImageUrl: options.ogImageUrl || "",
  slug: options.slug || "",
  title: options.title || "",
  type: options.type || TYPE.NEWS
});
