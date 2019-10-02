import { TYPE } from "../constants/performer.constants";
import { location, performer } from "./root.models";

describe("[models] Performer", () => {
  it("creates a valid object with defaults", () => {
    expect(performer()).toEqual({
      genre: "",
      imageUrl: "",
      location: location(),
      name: "",
      type: TYPE.BAND
    });
  });

  it("creates a valid object when all properties are defined", () => {
    const data = {
      genre: "Genre",
      imageUrl: "Image URL",
      location: { name: "Location" },
      name: "Name",
      type: TYPE.SOLO,
      url: "URL"
    };

    expect(performer(data)).toEqual({
      genre: data.genre,
      imageUrl: data.imageUrl,
      location: location(data.location),
      name: data.name,
      type: data.type,
      url: data.url
    });
  });
});
