import dayjs from "dayjs";

import { BOOLEAN } from "../constants/api.constants";
import {
  PLATFORM,
  PRODUCTION,
  PRODUCTION_OPTION,
  SCHEMA_TYPE,
  TYPE
} from "../constants/release.constants";
import { IImage, image, IPerformer, performer } from "./root.models";

export interface IReleasePlatformLink {
  readonly platform: PLATFORM;
  readonly url: string;
}

export interface IReleaseTrack {
  readonly genre: string;
  readonly length: string;
  readonly title: string;
  readonly url: string;
}

export interface IRawRelease {
  artist?: Partial<IPerformer>;
  buyList?: IReleasePlatformLink[];
  description?: string;
  genre?: string;
  images?: Array<Partial<IImage>>;
  isActive?: BOOLEAN;
  length?: string;
  productionType?: PRODUCTION_OPTION;
  recordLabel?: string;
  releasedOn?: string;
  slug?: string;
  streamList?: IReleasePlatformLink[];
  title?: string;
  tracklist?: Array<Array<Partial<IReleaseTrack>>>;
  type?: TYPE;
}

export interface IRelease {
  readonly artist: IPerformer;
  readonly buyList: IReleasePlatformLink[];
  readonly description: string;
  readonly genre: string;
  readonly images: IImage[];
  readonly isActive: boolean;
  readonly length: string;
  readonly productionType: PRODUCTION;
  readonly recordLabel: string;
  readonly releasedOn: string;
  readonly schemaType: SCHEMA_TYPE;
  readonly slug: string;
  readonly streamList: IReleasePlatformLink[];
  readonly title: string;
  readonly tracklist: IReleaseTrack[][];
  readonly type: TYPE;
}

export const productionType = (type?: PRODUCTION_OPTION) => {
  switch (type) {
    case PRODUCTION_OPTION.COMPILATION:
      return PRODUCTION.COMPILATION;

    case PRODUCTION_OPTION.DEMO:
      return PRODUCTION.DEMO;

    case PRODUCTION_OPTION.LIVE:
      return PRODUCTION.LIVE;

    case PRODUCTION_OPTION.REMIX:
      return PRODUCTION.REMIX;

    case PRODUCTION_OPTION.SOUNDTRACK:
      return PRODUCTION.SOUNDTRACK;

    default:
    case PRODUCTION_OPTION.STUDIO:
      return PRODUCTION.STUDIO;
  }
};

export const releaseSchemaType = (type?: TYPE) => {
  switch (type) {
    default:
    case TYPE.ALBUM:
      return SCHEMA_TYPE.ALBUM;

    case TYPE.EP:
      return SCHEMA_TYPE.EP;

    case TYPE.REMIX:
    case TYPE.SINGLE:
      return SCHEMA_TYPE.SINGLE;
  }
};

export const releasePlatformLink = (options: IReleasePlatformLink) => ({
  platform: options.platform,
  url: options.url
});

export const releaseTrack = (options: Partial<IReleaseTrack> = {}) => ({
  genre: options.genre || "",
  length: options.length || "0:00",
  title: options.title || "",
  url: options.url || ""
});

export const release = (options: IRawRelease = {}): IRelease => ({
  artist: performer(options.artist),
  buyList: options.buyList ? options.buyList.map(releasePlatformLink) : [],
  description: options.description || "",
  genre: options.genre || "",
  images: options.images ? options.images.map(image) : [],
  isActive: (options.isActive && options.isActive === BOOLEAN.TRUE) || false,
  length: options.length || "0:00",
  productionType: productionType(options.productionType),
  recordLabel: options.recordLabel || "",
  releasedOn:
    options.releasedOn ||
    dayjs()
      .startOf("day")
      .toISOString(),
  schemaType: releaseSchemaType(options.type),
  slug: options.slug || "",
  streamList: options.streamList
    ? options.streamList.map(releasePlatformLink)
    : [],
  title: options.title || "",
  tracklist: options.tracklist
    ? options.tracklist.map(disc => disc.map(releaseTrack))
    : [],
  type: options.type || TYPE.ALBUM
});
