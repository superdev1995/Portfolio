import dayjs from "dayjs";

import { BOOLEAN } from "../constants/api.constants";
import { PACKAGE_FORMAT } from "../constants/stem.constants";
import { stem } from "./root.models";

describe("[models] Stem", () => {
  it("creates a valid object with defaults", () => {
    expect(stem()).toEqual({
      audioFormat: "",
      createdAt: dayjs().toISOString(),
      imageUrl: "",
      isActive: false,
      packageFormat: PACKAGE_FORMAT.RAR,
      size: "0B",
      slug: "",
      title: "",
      url: ""
    });
  });

  it("creates a valid object when all properties are defined", () => {
    const data = {
      audioFormat: "Audio format",
      createdAt: "2019-01-01T00:00:00",
      imageUrl: "Image URL",
      isActive: BOOLEAN.TRUE,
      packageFormat: PACKAGE_FORMAT.ZIP,
      size: "256MB",
      slug: "test-1",
      title: "Title",
      url: "URL"
    };

    expect(stem(data)).toEqual({
      audioFormat: data.audioFormat,
      createdAt: data.createdAt,
      imageUrl: data.imageUrl,
      isActive: true,
      packageFormat: data.packageFormat,
      size: data.size,
      slug: data.slug,
      title: data.title,
      url: data.url
    });
  });
});
