import dayjs from "dayjs";

import { BOOLEAN } from "../constants/api.constants";
import { PACKAGE_FORMAT } from "../constants/stem.constants";

export interface IRawStem {
  audioFormat?: string;
  createdAt?: string;
  imageUrl?: string;
  isActive?: BOOLEAN;
  packageFormat?: PACKAGE_FORMAT;
  size?: string;
  slug?: string;
  title?: string;
  url?: string;
}

export interface IStem {
  readonly audioFormat: string;
  readonly createdAt: string;
  readonly imageUrl: string;
  readonly isActive: boolean;
  readonly packageFormat: PACKAGE_FORMAT;
  readonly size: string;
  readonly slug: string;
  readonly title: string;
  readonly url: string;
}

export const stem = (options: IRawStem = {}): IStem => ({
  audioFormat: options.audioFormat || "",
  createdAt: options.createdAt || dayjs().toISOString(),
  imageUrl: options.imageUrl || "",
  isActive: (options.isActive && options.isActive === BOOLEAN.TRUE) || false,
  packageFormat: options.packageFormat || PACKAGE_FORMAT.RAR,
  size: options.size || "0B",
  slug: options.slug || "",
  title: options.title || "",
  url: options.url || ""
});
