import { TYPE } from "../constants/performer.constants";
import { ILocation, location } from "./location.models";

export interface IRawPerformer {
  genre?: string;
  imageUrl?: string;
  location?: Partial<ILocation>;
  name?: string;
  type?: TYPE;
  url?: string;
}

export interface IPerformer {
  readonly genre: string;
  readonly imageUrl: string;
  readonly location: ILocation;
  readonly name: string;
  readonly type: TYPE;
  readonly url?: string;
}

export const performer = (options: IRawPerformer = {}): IPerformer => ({
  genre: options.genre || "",
  imageUrl: options.imageUrl || "",
  location: location(options.location),
  name: options.name || "",
  type: options.type || TYPE.BAND,
  url: options.url
});
