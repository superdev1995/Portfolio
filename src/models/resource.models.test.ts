import dayjs from "dayjs";

import { BOOLEAN } from "../constants/api.constants";
import { TYPE } from "../constants/resource.constants";
import { resource } from "./root.models";

describe("[models] Resource", () => {
  it("creates a valid object with defaults", () => {
    expect(resource()).toEqual({
      createdAt: dayjs().toISOString(),
      description: "",
      imageUrl: "",
      isActive: false,
      slug: "",
      title: "",
      type: TYPE.DESIGN,
      url: ""
    });
  });

  it("creates a valid object when all properties are defined", () => {
    const data = {
      createdAt: "2019-01-01T00:00:00",
      description: "Description",
      imageUrl: "Image URL",
      isActive: BOOLEAN.TRUE,
      slug: "test-1",
      title: "Title",
      type: TYPE.PRESS,
      url: "URL"
    };

    expect(resource(data)).toEqual({
      createdAt: data.createdAt,
      description: data.description,
      imageUrl: data.imageUrl,
      isActive: true,
      slug: data.slug,
      title: data.title,
      type: data.type,
      url: data.url
    });
  });
});
