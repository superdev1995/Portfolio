import * as actions from "../../../actions/root.actions";
import { release } from "../../../models/root.models";
import ComponentTester from "../../../utilities/ComponentTester";
import MockPageContext from "../../../utilities/MockPageContext";
import ReleaseRoute from "./ReleaseRoute";

const item = release({
  images: [{ imageUrl: "Image URL 1" }, { imageUrl: "Image URL 2" }],
  slug: "test-1",
  tracklist: [[{ title: "Disc 1, Track 1" }], [{ title: "Disc 2, Track 1" }]]
});

const defaultState = {
  releases: {
    currentSlug: item.slug,
    items: {
      [item.slug]: item
    }
  }
};

const component = new ComponentTester(ReleaseRoute, true);

describe("[routes] <ReleaseRoute />", () => {
  describe("getInitialProps", () => {
    const context = new MockPageContext()
      .withDefaultQuery({
        slug: item.slug
      })
      .withDefaultReduxState(defaultState);

    describe("when the release isn't already in the store", () => {
      const slug = "new-slug";

      it("calls getInitialProps method", async () => {
        await ReleaseRoute.getInitialProps(
          context.withQuery({ slug }).toObject()
        );
      });

      it("dispatches actions.setCurrentReleaseSlug with expected payload", () => {
        const matchingActions = context.reduxHistory.filter(
          actions.setCurrentReleaseSlug.match
        );

        expect(matchingActions).toHaveLength(1);
        expect(matchingActions[0].payload).toBe(slug);
      });

      it("dispatches actions.fetchReleaseBySlug.started", () => {
        expect(
          context.reduxHistory.filter(actions.fetchReleaseBySlug.started.match)
        ).toHaveLength(1);
      });
    });

    describe("when the article is already in the store", () => {
      it("calls getInitialProps method", async () => {
        await ReleaseRoute.getInitialProps(context.toObject());
      });

      it("dispatches actions.setCurrentReleaseSlug", () => {
        expect(
          context.reduxHistory.filter(actions.setCurrentReleaseSlug.match)
        ).toHaveLength(1);
      });

      it("doesn't dispatch actions.fetchReleaseBySlug.started", () => {
        expect(
          context.reduxHistory.filter(actions.fetchReleaseBySlug.started.match)
        ).toHaveLength(0);
      });
    });
  });

  it("matches snapshot", () => {
    const { wrapper } = component.withReduxState(defaultState).mount();

    expect(wrapper.render()).toMatchSnapshot();
  });

  it("renders a loader when isLoading is true", () => {
    const { wrapper } = component
      .withReduxState({
        ...defaultState,
        releases: { isLoading: true }
      })
      .mount();

    expect(wrapper.find("Loader")).toHaveLength(1);
  });

  it("doesn't render anything when no release exists", () => {
    const { wrapper } = component
      .withReduxState({
        news: {
          currentSlug: undefined,
          hasError: true,
          items: {}
        }
      })
      .mount();

    expect(wrapper.render().html()).toBeNull();
  });

  it("tracks carousel interactions correctly", () => {
    const { wrapper } = component.withReduxState(defaultState).mount();

    wrapper
      .find(".Carousel--pagination--page")
      .last()
      .simulate("click");

    const matchingActions = component.reduxHistory.filter(
      actions.trackEvent.match
    );

    expect(matchingActions).toHaveLength(1);
    expect(matchingActions[0].payload).toEqual({
      event: "release.carousel.slideChange",
      index: 1
    });
  });
});
