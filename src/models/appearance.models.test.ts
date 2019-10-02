import dayjs from "dayjs";

import { BOOLEAN } from "../constants/api.constants";
import { STATUS, TYPE } from "../constants/appearance.constants";
import {
  appearance,
  image,
  location,
  offer,
  organization,
  performer
} from "./root.models";

describe("[models] Appearance", () => {
  it("creates a valid object with defaults", () => {
    expect(appearance()).toEqual({
      acts: [],
      audience: undefined,
      description: "",
      finishingAt: dayjs().toISOString(),
      imageUrl: "",
      images: [],
      isActive: false,
      location: location(),
      ogImageUrl: "",
      organizer: organization(),
      rsvpUrl: undefined,
      sales: [],
      slug: "",
      startingAt: dayjs().toISOString(),
      status: STATUS.SCHEDULED,
      title: "",
      type: TYPE.MUSIC
    });
  });

  it("creates a valid object when all properties are defined", () => {
    const data = {
      acts: [{ name: "Performer" }],
      audience: "18+",
      description: "Description",
      finishingAt: "2019-01-02T00:00:00",
      imageUrl: "Image",
      images: [{ imageUrl: "URL", title: "Title" }],
      isActive: BOOLEAN.TRUE,
      location: { name: "Location" },
      ogImageUrl: "OG URL",
      organizer: { name: "Organizer" },
      rsvpUrl: "RSVP",
      sales: [{ price: 20.0 }],
      slug: "test-1",
      startingAt: "2019-01-01T20:00:00",
      status: STATUS.POSTPONED,
      title: "Title",
      type: TYPE.FESTIVAL
    };

    expect(appearance(data)).toEqual({
      acts: data.acts.map(performer),
      audience: data.audience,
      description: data.description,
      finishingAt: data.finishingAt,
      imageUrl: data.imageUrl,
      images: data.images.map(image),
      isActive: true,
      location: location(data.location),
      ogImageUrl: data.ogImageUrl,
      organizer: organization(data.organizer),
      rsvpUrl: data.rsvpUrl,
      sales: data.sales.map(offer),
      slug: data.slug,
      startingAt: data.startingAt,
      status: data.status,
      title: data.title,
      type: data.type
    });
  });
});
