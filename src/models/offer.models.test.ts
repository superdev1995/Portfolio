import { AVAILABILITY } from "../constants/offer.constants";
import { offer } from "./root.models";

describe("[models] Offer", () => {
  it("creates a valid object with defaults", () => {
    expect(offer()).toEqual({
      availability: AVAILABILITY.LIMITED,
      name: "",
      price: 0,
      priceCurrency: "NZD"
    });
  });

  it("creates a valid object when all properties are defined", () => {
    const data = {
      availability: AVAILABILITY.OUT_OF_STOCK,
      name: "Name",
      price: 999.99,
      priceCurrency: "USD",
      url: "URL",
      validFrom: "2019-01-01T00:00:00"
    };

    expect(offer(data)).toEqual({
      availability: data.availability,
      name: data.name,
      price: data.price,
      priceCurrency: data.priceCurrency,
      url: data.url,
      validFrom: data.validFrom
    });
  });
});
