import dayjs from "dayjs";

import { gallery, galleryImage } from "./root.models";

describe("[models] Gallery", () => {
  describe("gallery", () => {
    it("creates a valid object with defaults", () => {
      expect(gallery()).toEqual({
        imageUrl: "",
        modifiedAt: dayjs().toISOString(),
        slug: "",
        title: ""
      });
    });

    it("creates a valid object when all properties are defined", () => {
      const data = {
        description: "Description",
        imageUrl: "Image URL",
        images: [{ imageUrl: "Image URL" }],
        modifiedAt: "2019-01-01T00:00:00",
        slug: "gallery-1",
        title: "Title"
      };

      expect(gallery(data)).toEqual({
        description: data.description,
        imageUrl: data.imageUrl,
        images: data.images.map(galleryImage),
        modifiedAt: data.modifiedAt,
        slug: data.slug,
        title: data.title
      });
    });
  });

  describe("galleryImage", () => {
    it("creates a valid object with defaults", () => {
      expect(galleryImage()).toEqual({
        imageUrl: "",
        modifiedAt: dayjs().toISOString()
      });
    });

    it("creates a valid object when all properties are defined", () => {
      const data = {
        imageUrl: "Image URL",
        modifiedAt: "2019-01-01T00:00:00"
      };

      expect(galleryImage(data)).toEqual({
        imageUrl: data.imageUrl,
        modifiedAt: data.modifiedAt
      });
    });
  });
});
