import * as actions from "../../../actions/root.actions";
import { gallery } from "../../../models/root.models";
import ComponentTester from "../../../utilities/ComponentTester";
import MockPageContext from "../../../utilities/MockPageContext";
import GalleryRoute from "./GalleryRoute";

const item = gallery({
  images: [{ imageUrl: "1" }, { imageUrl: "2" }],
  slug: "test-1"
});

const defaultState = {
  galleries: {
    currentSlug: item.slug,
    items: {
      [item.slug]: item
    }
  }
};

const component = new ComponentTester(GalleryRoute, true);

describe("[routes] <GalleryRoute />", () => {
  describe("getInitialProps", () => {
    const context = new MockPageContext()
      .withDefaultQuery({
        slug: item.slug
      })
      .withDefaultReduxState(defaultState);

    describe("when the gallery isn't already in the store", () => {
      const slug = "new-slug";

      it("calls getInitialProps method", async () => {
        await GalleryRoute.getInitialProps(
          context.withQuery({ slug }).toObject()
        );
      });

      it("dispatches actions.setCurrentGallerySlug with expected payload", () => {
        const matchingActions = context.reduxHistory.filter(
          actions.setCurrentGallerySlug.match
        );

        expect(matchingActions).toHaveLength(1);
        expect(matchingActions[0].payload).toBe(slug);
      });

      it("dispatches actions.fetchGalleryBySlug.started", () => {
        expect(
          context.reduxHistory.filter(actions.fetchGalleryBySlug.started.match)
        ).toHaveLength(1);
      });
    });

    describe("when the gallery is already in the store", () => {
      it("calls getInitialProps method", async () => {
        await GalleryRoute.getInitialProps(context.toObject());
      });

      it("dispatches actions.setCurrentGallerySlug", () => {
        expect(
          context.reduxHistory.filter(actions.setCurrentGallerySlug.match)
        ).toHaveLength(1);
      });

      it("doesn't dispatch actions.fetchGalleryBySlug.started", () => {
        expect(
          context.reduxHistory.filter(actions.fetchGalleryBySlug.started.match)
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
        galleries: { isLoading: true }
      })
      .mount();

    expect(wrapper.find("Loader")).toHaveLength(1);
  });

  it("doesn't render anything when no gallery exists", () => {
    const { wrapper } = component
      .withReduxState({
        galleries: {
          currentSlug: undefined,
          hasError: true,
          items: {}
        }
      })
      .mount();

    expect(wrapper.render().html()).toBeNull();
  });

  it("tracks gallery interactions correctly", () => {
    const { wrapper } = component.withReduxState(defaultState).mount();

    wrapper
      .find("ImageGallery Image")
      .last()
      .simulate("click");

    const matchingActions = component.reduxHistory.filter(
      actions.trackEvent.match
    );

    expect(matchingActions).toHaveLength(1);
    expect(matchingActions[0].payload).toEqual({
      event: "gallery.gallery.itemClick",
      index: 1
    });
  });
});
