import dayjs from "dayjs";

import { BOOLEAN } from "../../../constants/api.constants";
import { STATUS } from "../../../constants/appearance.constants";
import {
  appearance,
  image,
  location,
  offer,
  organization
} from "../../../models/root.models";
import ComponentTester from "../../../utilities/ComponentTester";
import Appearance from "./Appearance";

const component = new ComponentTester(Appearance).withDefaultProps(
  appearance({
    acts: [
      {
        genre: "Genre",
        imageUrl: "Image URL",
        location: {
          address: "City, Country"
        },
        name: "Act name"
      }
    ],
    description: "Description",
    finishingAt: dayjs()
      .add(4, "day")
      .toISOString(),
    imageUrl: "Image URL",
    isActive: BOOLEAN.TRUE,
    location: {
      latLng: {
        lat: 0,
        lng: 0
      },
      name: "Venue"
    },
    organizer: {
      name: "Organizer"
    },
    startingAt: dayjs()
      .add(3, "day")
      .toISOString(),
    status: STATUS.SCHEDULED
  })
);

describe("[presentation] <Appearance />", () => {
  describe("when only the required props are defined", () => {
    const { wrapper } = component.render();

    it("doesn't render the audience meta item", () => {
      expect(wrapper.find(".Appearance--audience")).toHaveLength(0);
    });

    it("doesn't render the status notice", () => {
      expect(wrapper.find(".Appearance--status")).toHaveLength(0);
    });

    it("doesn't render the RSVP section", () => {
      expect(wrapper.find(".Appearance--rsvp")).toHaveLength(0);
    });

    it("doesn't render the tickets section", () => {
      expect(wrapper.find(".Appearance--tickets")).toHaveLength(0);
    });

    it("doesn't render the images section", () => {
      expect(wrapper.find(".Appearance--images")).toHaveLength(0);
    });

    it("doesn't render map section", () => {
      expect(wrapper.find(".Appearance--map")).toHaveLength(0);
    });

    it("matches snapshot", () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe("when all props are defined", () => {
    const { wrapper } = component
      .withProps({
        audience: "18+",
        images: [
          {
            imageUrl: "Image URL 1",
            title: "Title 1"
          },
          {
            imageUrl: "Image URL 2",
            title: "Title 2"
          }
        ],
        location: location({
          address: "123 Address",
          name: "Venue"
        }),
        locationLatLng: { lat: 0, lng: 0 },
        organizer: organization({
          email: "Email",
          logo: "Logo",
          name: "Organizer"
        }),
        rsvpUrl: "RSVP",
        sales: [
          offer({
            name: "Name",
            price: 10
          })
        ]
      })
      .render();

    it("renders the audience meta item", () => {
      expect(wrapper.find(".Appearance--audience")).toHaveLength(1);
    });

    it("renders the RSVP section", () => {
      expect(wrapper.find(".Appearance--rsvp")).toHaveLength(1);
    });

    it("renders the tickets section", () => {
      expect(wrapper.find(".Appearance--tickets")).toHaveLength(1);
    });

    it("renders the images section", () => {
      expect(wrapper.find(".Appearance--images")).toHaveLength(1);
    });

    it("renders the map section", () => {
      expect(wrapper.find(".Appearance--map")).toHaveLength(1);
    });

    it("matches snapshot", () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe("when cancelled", () => {
    const { wrapper } = component
      .withProps({
        sales: [offer()],
        status: STATUS.CANCELLED
      })
      .render();

    it("has the isCancelled class", () => {
      expect(wrapper.hasClass("isCancelled")).toBe(true);
    });

    it("renders the status notice with CANCELLED text", () => {
      expect(wrapper.find(".Appearance--status")).toHaveLength(1);
    });

    it("doesn't render the tickets section", () => {
      expect(wrapper.find(".Appearance--tickets")).toHaveLength(0);
    });

    it("matches snapshot", () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe("when postponed", () => {
    const { wrapper } = component
      .withProps({
        sales: [offer()],
        status: STATUS.POSTPONED
      })
      .render();

    it("has the isPostponed class", () => {
      expect(wrapper.hasClass("isPostponed")).toBe(true);
    });

    it("renders the status notice with POSTPONED text", () => {
      expect(wrapper.find(".Appearance--status")).toHaveLength(1);
    });

    it("doesn't render the tickets section", () => {
      expect(wrapper.find(".Appearance--tickets")).toHaveLength(0);
    });

    it("matches snapshot", () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe("when finishingAt is in the past", () => {
    const { wrapper } = component
      .withProps({
        finishingAt: dayjs()
          .subtract(1, "day")
          .toISOString()
      })
      .render();

    it("has the isFinished class", () => {
      expect(wrapper.hasClass("isFinished")).toBe(true);
    });

    it("doesn't render the tickets section", () => {
      expect(wrapper.find(".Appearance--tickets")).toHaveLength(0);
    });

    it("matches snapshot", () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe("when interacting with the gallery", () => {
    const { wrapper, props } = component
      .withProps({
        images: [image()],
        onGalleryInteraction: jest.fn()
      })
      .mount();

    it("clicks a gallery image", () => {
      // @ts-ignore-next-line
      wrapper.find("ImageGallery").prop("onItemClick")(0);
    });

    it("calls the onGalleryInteraction prop", () => {
      expect(props.onGalleryInteraction).toHaveBeenCalledTimes(1);
    });

    it("sets the onGalleryInteractionProp to be undefined", () => {
      wrapper.setProps({ onGalleryInteraction: undefined });
    });

    it("clicks a gallery image", () => {
      // @ts-ignore-next-line
      wrapper.find("ImageGallery").prop("onItemClick")(0);
    });
  });
});
