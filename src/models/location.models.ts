import { TYPE } from "../constants/location.constants";

export interface ILatLng {
  readonly lat: number;
  readonly lng: number;
}

export interface ILocation {
  readonly address?: string;
  readonly latLng?: ILatLng;
  readonly name: string;
  readonly type: TYPE;
  readonly url?: string;
}

export const location = (options: Partial<ILocation> = {}): ILocation => ({
  address: options.address,
  latLng: options.latLng,
  name: options.name || "",
  type: options.type || TYPE.MUSIC_VENUE,
  url: options.url
});
