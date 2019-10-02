import dayjs from "dayjs";

import { BOOLEAN } from "../constants/api.constants";
import { TYPE } from "../constants/news.constants";
import { newsArticle } from "./root.models";

describe("[models] News", () => {
  it("creates a valid object with defaults", () => {
    expect(newsArticle()).toEqual({
      author: "",
      content: "",
      createdAt: dayjs().toISOString(),
      excerpt: "",
      imageUrl: "",
      isActive: false,
      ogImageUrl: "",
      slug: "",
      title: "",
      type: TYPE.NEWS
    });
  });

  it("creates a valid object when all properties are defined", () => {
    const data = {
      action: {
        route: "/releases/test-1",
        text: "Action"
      },
      author: "Author",
      content: "Content",
      createdAt: "2019-01-01T00:00:00",
      excerpt: "Excerpt",
      imageUrl: "Image URL",
      isActive: BOOLEAN.TRUE,
      ogImageUrl: "OG image URL",
      slug: "test-1",
      title: "Title",
      type: TYPE.RELEASE
    };

    expect(newsArticle(data)).toEqual({
      action: data.action,
      author: data.author,
      content: data.content,
      createdAt: data.createdAt,
      excerpt: data.excerpt,
      imageUrl: data.imageUrl,
      isActive: true,
      ogImageUrl: data.ogImageUrl,
      slug: data.slug,
      title: data.title,
      type: data.type
    });
  });
});
