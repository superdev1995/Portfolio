import { PLATFORM } from "../../../constants/release.constants";
import {
  image,
  release,
  releasePlatformLink,
  releaseTrack
} from "../../../models/root.models";
import ComponentTester from "../../../utilities/ComponentTester";
import Release from "./Release";

const component = new ComponentTester(Release).withDefaultProps(
  release({
    artist: {
      name: "Artist Name",
      url: "URL"
    },
    buyList: [],
    description: "Description",
    genre: "Genre",
    images: [
      {
        imageUrl: "Image URL",
        title: "Image title"
      }
    ],
    length: "5:00",
    recordLabel: "Record Label",
    releasedOn: "2017-01-01T00:00:00",
    slug: "release-1",
    streamList: [],
    title: "Title",
    tracklist: [
      [
        {
          genre: "Genre",
          length: "5:00",
          title: "Title",
          url: "URL"
        }
      ]
    ]
  })
);

describe("[presentation] <Release />", () => {
  describe("when the minimum props are defined, with only one disc", () => {
    const { wrapper } = component.render();

    it("doesn't render the disc number heading", () => {
      expect(wrapper.find(".Release--tracklist h3")).toHaveLength(0);
    });

    it("doesn't render the stream list section", () => {
      expect(wrapper.find(".Release--streamList")).toHaveLength(0);
    });

    it("doesn't render the buy list section", () => {
      expect(wrapper.find(".Release--buyList")).toHaveLength(0);
    });

    it("matches snapshot", () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe("when all props are defined, with multiple discs", () => {
    const { wrapper } = component
      .withProps({
        buyList: [
          releasePlatformLink({ platform: PLATFORM.ITUNES, url: "URL" })
        ],
        streamList: [
          releasePlatformLink({ platform: PLATFORM.SPOTIFY, url: "URL" })
        ],
        tracklist: [
          [
            releaseTrack({ title: "Disc 1, Track 1" }),
            releaseTrack({ title: "Disc 1, Track 2" })
          ],
          [
            releaseTrack({ title: "Disc 2, Track 1" }),
            releaseTrack({ title: "Disc 2, Track 2" })
          ]
        ]
      })
      .render();

    it("renders the disc number headings", () => {
      expect(wrapper.find(".Release--tracklist h3")).toHaveLength(2);
    });

    it("renders the stream list section", () => {
      expect(wrapper.find(".Release--streamList")).toHaveLength(1);
    });

    it("renders the buy list section", () => {
      expect(wrapper.find(".Release--buyList")).toHaveLength(1);
    });

    it("matches snapshot", () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe("when interacting with the carousel", () => {
    const { props, wrapper } = component
      .withProps({
        images: [
          image({ imageUrl: "Image URL", title: "Image 1" }),
          image({ imageUrl: "Image URL", title: "Image 2" })
        ],
        onCarouselSlideChange: jest.fn()
      })
      .mount();

    it("navigates to the second image", () => {
      wrapper
        .find("Carousel Button.Carousel--pagination--page")
        .at(1)
        .simulate("click");
    });

    it("calls the onCarouselSlideChange prop with the expected payload", () => {
      expect(props.onCarouselSlideChange).toHaveBeenCalledTimes(1);
      expect(props.onCarouselSlideChange).toHaveBeenCalledWith(1);
    });

    it("sets the onCarouselSlideChange prop to be undefined", () => {
      wrapper.setProps({ onCarouselSlideChange: undefined });
    });

    it("navigates to the first image", () => {
      wrapper
        .find("Carousel Button.Carousel--pagination--page")
        .at(0)
        .simulate("click");
    });
  });
});
