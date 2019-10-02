import dayjs from "dayjs";

import { BOOLEAN } from "../constants/api.constants";
import {
  PLATFORM,
  PRODUCTION,
  PRODUCTION_OPTION,
  SCHEMA_TYPE,
  TYPE
} from "../constants/release.constants";
import {
  image,
  performer,
  productionType,
  release,
  releasePlatformLink,
  releaseSchemaType,
  releaseTrack
} from "./root.models";

describe("[models] Release", () => {
  describe("release", () => {
    it("creates a valid object with defaults", () => {
      expect(release()).toEqual({
        artist: performer(),
        buyList: [],
        description: "",
        genre: "",
        images: [],
        isActive: false,
        length: "0:00",
        productionType: PRODUCTION.STUDIO,
        recordLabel: "",
        releasedOn: dayjs()
          .startOf("day")
          .toISOString(),
        schemaType: SCHEMA_TYPE.ALBUM,
        slug: "",
        streamList: [],
        title: "",
        tracklist: [],
        type: TYPE.ALBUM
      });
    });

    it("creates a valid object when all properties are defined", () => {
      const data = {
        artist: {
          name: "Artist",
          url: "URL"
        },
        buyList: [{ platform: PLATFORM.ITUNES, url: "URL" }],
        description: "Description",
        genre: "Genre",
        images: [{ imageUrl: "Image URL" }],
        isActive: BOOLEAN.TRUE,
        length: "11:11",
        productionType: PRODUCTION_OPTION.LIVE,
        recordLabel: "Record label",
        releasedOn: "2019-01-01",
        slug: "test-1",
        streamList: [{ platform: PLATFORM.SPOTIFY, url: "URL" }],
        title: "Title",
        tracklist: [
          [{ title: "Disc 1, track 1" }],
          [{ title: "Disc 2, track 1" }]
        ],
        type: TYPE.EP
      };

      expect(release(data)).toEqual({
        artist: performer(data.artist),
        buyList: data.buyList.map(releasePlatformLink),
        description: data.description,
        genre: data.genre,
        images: data.images.map(image),
        isActive: true,
        length: data.length,
        productionType: PRODUCTION.LIVE,
        recordLabel: data.recordLabel,
        releasedOn: data.releasedOn,
        schemaType: SCHEMA_TYPE.EP,
        slug: data.slug,
        streamList: data.streamList.map(releasePlatformLink),
        title: data.title,
        tracklist: data.tracklist.map(disc => disc.map(releaseTrack)),
        type: TYPE.EP
      });
    });
  });

  describe("releaseTrack", () => {
    it("creates a valid object with defaults", () => {
      expect(releaseTrack()).toEqual({
        genre: "",
        length: "0:00",
        title: "",
        url: ""
      });
    });

    it("creates a valid object when all properties are defined", () => {
      const data = {
        genre: "Genre",
        length: "11:11",
        title: "Title",
        url: "URL"
      };

      expect(releaseTrack(data)).toEqual(data);
    });
  });

  describe("productionType", () => {
    it("returns the correct value for COMPILATION", () => {
      expect(productionType(PRODUCTION_OPTION.COMPILATION)).toBe(
        PRODUCTION.COMPILATION
      );
    });

    it("returns the correct value for DEMO", () => {
      expect(productionType(PRODUCTION_OPTION.DEMO)).toBe(PRODUCTION.DEMO);
    });

    it("returns the correct value for LIVE", () => {
      expect(productionType(PRODUCTION_OPTION.LIVE)).toBe(PRODUCTION.LIVE);
    });

    it("returns the correct value for REMIX", () => {
      expect(productionType(PRODUCTION_OPTION.REMIX)).toBe(PRODUCTION.REMIX);
    });

    it("returns the correct value for SOUNDTRACK", () => {
      expect(productionType(PRODUCTION_OPTION.SOUNDTRACK)).toBe(
        PRODUCTION.SOUNDTRACK
      );
    });

    it("returns the correct value for STUDIO", () => {
      expect(productionType(PRODUCTION_OPTION.STUDIO)).toBe(PRODUCTION.STUDIO);
    });

    it("returns the correct default value", () => {
      expect(productionType()).toBe(PRODUCTION.STUDIO);
    });
  });

  describe("releaseSchemaType", () => {
    it("returns the correct value for ALBUM", () => {
      expect(releaseSchemaType(TYPE.ALBUM)).toBe(SCHEMA_TYPE.ALBUM);
    });

    it("returns the correct value for EP", () => {
      expect(releaseSchemaType(TYPE.EP)).toBe(SCHEMA_TYPE.EP);
    });

    it("returns the correct value for REMIX", () => {
      expect(releaseSchemaType(TYPE.REMIX)).toBe(SCHEMA_TYPE.SINGLE);
    });

    it("returns the correct value for SINGLE", () => {
      expect(releaseSchemaType(TYPE.SINGLE)).toBe(SCHEMA_TYPE.SINGLE);
    });

    it("returns the correct default value", () => {
      expect(releaseSchemaType()).toBe(SCHEMA_TYPE.ALBUM);
    });
  });
});
