import { AVAILABILITY } from "../constants/offer.constants";

export interface IOffer {
  readonly availability: AVAILABILITY;
  readonly name: string;
  readonly price: number;
  readonly priceCurrency: string;
  readonly url?: string;
  readonly validFrom?: string;
}

export const offer = (options: Partial<IOffer> = {}): IOffer => ({
  availability: options.availability || AVAILABILITY.LIMITED,
  name: options.name || "",
  price: options.price || 0,
  priceCurrency: options.priceCurrency || "NZD",
  url: options.url,
  validFrom: options.validFrom
});
