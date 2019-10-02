import dayjs from "dayjs";
import { BOOLEAN } from "../constants/api.constants";
import { TYPE } from "../constants/resource.constants";

export interface IRawResource {
  createdAt?: string;
  description?: string;
  imageUrl?: string;
  isActive?: BOOLEAN;
  slug?: string;
  title?: string;
  type?: TYPE;
  url?: string;
}

export interface IResource {
  readonly createdAt: string;
  readonly description: string;
  readonly imageUrl: string;
  readonly isActive: boolean;
  readonly slug: string;
  readonly title: string;
  readonly type: TYPE;
  readonly url: string;
}

export const resource = (options: IRawResource = {}): IResource => ({
  createdAt: options.createdAt || dayjs().toISOString(),
  description: options.description || "",
  imageUrl: options.imageUrl || "",
  isActive: (options.isActive && options.isActive === BOOLEAN.TRUE) || false,
  slug: options.slug || "",
  title: options.title || "",
  type: options.type || TYPE.DESIGN,
  url: options.url || ""
});
