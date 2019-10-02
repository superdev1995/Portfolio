import dayjs from "dayjs";

import { BOOLEAN } from "../constants/api.constants";
import { STATUS, TYPE } from "../constants/appearance.constants";
import { IImage, image } from "./image.models";
import { ILocation, location } from "./location.models";
import { IOffer, offer } from "./offer.models";
import { IOrganization, organization } from "./organization.models";
import { IPerformer, IRawPerformer, performer } from "./performer.models";

export interface IRawAppearance {
  acts?: Array<Partial<IRawPerformer>>;
  audience?: string;
  description?: string;
  finishingAt?: string;
  imageUrl?: string;
  images?: IImage[];
  isActive?: BOOLEAN;
  location?: Partial<ILocation>;
  ogImageUrl?: string;
  organizer?: Partial<IOrganization>;
  rsvpUrl?: string;
  sales?: Array<Partial<IOffer>>;
  slug?: string;
  startingAt?: string;
  status?: STATUS;
  title?: string;
  type?: TYPE;
}

export interface IAppearance {
  readonly acts: IPerformer[];
  readonly audience?: string;
  readonly description: string;
  readonly finishingAt: string;
  readonly imageUrl: string;
  readonly images: IImage[];
  readonly isActive: boolean;
  readonly location: ILocation;
  readonly ogImageUrl: string;
  readonly organizer: IOrganization;
  readonly rsvpUrl?: string;
  readonly sales: IOffer[];
  readonly slug: string;
  readonly startingAt: string;
  readonly status: STATUS;
  readonly title: string;
  readonly type: TYPE;
}

export const appearance = (options: IRawAppearance = {}): IAppearance => ({
  acts: options.acts ? options.acts.map(performer) : [],
  audience: options.audience,
  description: options.description || "",
  finishingAt: options.finishingAt || dayjs().toISOString(),
  imageUrl: options.imageUrl || "",
  images: options.images ? options.images.map(image) : [],
  isActive: (options.isActive && options.isActive === BOOLEAN.TRUE) || false,
  location: location(options.location),
  ogImageUrl: options.ogImageUrl || "",
  organizer: organization(options.organizer),
  rsvpUrl: options.rsvpUrl,
  sales: options.sales ? options.sales.map(offer) : [],
  slug: options.slug || "",
  startingAt: options.startingAt || dayjs().toISOString(),
  status: options.status || STATUS.SCHEDULED,
  title: options.title || "",
  type: options.type || TYPE.MUSIC
});
