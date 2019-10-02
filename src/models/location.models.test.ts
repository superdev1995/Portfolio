import { TYPE } from "../constants/location.constants";
import { location } from "./location.models";

describe("[models] Location", () => {
  it("creates a valid object with defaults", () => {
    expect(location()).toEqual({
      name: "",
      type: TYPE.MUSIC_VENUE
    });
  });

  it("creates a valid object when all properties are defined", () => {
    const data = {
      address: "123 Address",
      latLng: { lat: 0, lng: 0 },
      name: "Name",
      type: TYPE.STADIUM,
      url: "URL"
    };

    expect(location(data)).toEqual({
      address: data.address,
      latLng: data.latLng,
      name: data.name,
      type: data.type,
      url: data.url
    });
  });
});
