import dayjs from "dayjs";

import { BOOLEAN } from "../../../constants/api.constants";
import { STATUS } from "../../../constants/appearance.constants";
import {
  appearance,
  location,
  offer,
  organization
} from "../../../models/root.models";
import ComponentTester from "../../../utilities/ComponentTester";
import AppearanceListing from "./AppearanceListing";

const component = new ComponentTester(AppearanceListing).withDefaultProps(
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

describe("[presentation] <AppearanceListing />", () => {
  describe("when only the required props are defined", () => {
    const { wrapper } = component.render();

    it("doesn't have the isCondensed class", () => {
      expect(wrapper.hasClass("isCondensed")).toBe(false);
    });

    it("doesn't render the status notice", () => {
      expect(wrapper.find(".AppearanceListing--status")).toHaveLength(0);
    });

    it("doesn't render the audience meta item", () => {
      expect(wrapper.find(".AppearanceListing--audience")).toHaveLength(0);
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
        isCondensed: true,
        location: location({
          address: "123 Address",
          name: "Venue"
        }),
        organizer: organization({
          email: "Email",
          logo: "Logo",
          name: "Organizer"
        }),
        rsvpUrl: "RSVP",
        sales: [
          offer({
            name: "Price 1",
            price: 40
          }),
          offer({
            name: "Price 2",
            price: 20
          }),
          offer({
            name: "Price 3",
            price: 25
          })
        ]
      })
      .render();

    it("has the isCondensed class", () => {
      expect(wrapper.hasClass("isCondensed")).toBe(true);
    });

    it("renders the audience meta item", () => {
      expect(wrapper.find(".AppearanceListing--audience")).toHaveLength(1);
    });

    it("matches snapshot", () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe("when there are no sales", () => {
    const { wrapper } = component
      .withProps({
        sales: []
      })
      .render();

    it("matches snapshot", () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe("when there is only one sale", () => {
    const { wrapper } = component
      .withProps({
        sales: [
          offer({
            name: "Price",
            price: 5
          })
        ]
      })
      .render();

    it("matches snapshot", () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe("when there are two sales", () => {
    const { wrapper } = component
      .withProps({
        sales: [
          offer({
            name: "Price 1",
            price: 5
          }),
          offer({
            name: "Price 2",
            price: 10
          })
        ]
      })
      .render();

    it("matches snapshot", () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe("when there are three sales", () => {
    const { wrapper } = component
      .withProps({
        sales: [
          offer({
            name: "Price 1",
            price: 5
          }),
          offer({
            name: "Price 2",
            price: 10
          }),
          offer({
            name: "Price 2",
            price: 10
          })
        ]
      })
      .render();

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
      expect(wrapper.find(".AppearanceListing--status")).toHaveLength(1);
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
      expect(wrapper.find(".AppearanceListing--status")).toHaveLength(1);
    });

    it("matches snapshot", () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe("when the image loads", () => {
    describe("when the onLoad prop isn't defined", () => {
      const { wrapper } = component.mount();

      it("triggers image load", () => {
        wrapper.find("img").simulate("load");
      });

      it("has the isRendered class", () => {
        expect(wrapper.render().hasClass("isRendered")).toBe(true);
      });
    });

    describe("when the onLoad prop is defined", () => {
      const { props, wrapper } = component
        .withProps({
          onLoad: jest.fn()
        })
        .mount();

      it("triggers image load", () => {
        wrapper.find("img").simulate("load");
      });

      it("calls the onLoad prop", () => {
        expect(props.onLoad).toHaveBeenCalled();
      });

      it("has the isRendered class", () => {
        expect(wrapper.render().hasClass("isRendered")).toBe(true);
      });
    });
  });
});
