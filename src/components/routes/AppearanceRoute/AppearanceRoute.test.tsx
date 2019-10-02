import * as actions from "../../../actions/root.actions";
import { appearance, image } from "../../../models/root.models";
import ComponentTester from "../../../utilities/ComponentTester";
import MockPageContext from "../../../utilities/MockPageContext";
import AppearanceRoute from "./AppearanceRoute";

const item = appearance({
  images: [image({ imageUrl: "1" }), image({ imageUrl: "2" })],
  slug: "test-1"
});

const defaultState = {
  appearances: {
    currentSlug: item.slug,
    items: {
      [item.slug]: item
    }
  }
};

const component = new ComponentTester(AppearanceRoute, true);

describe("[routes] <AppearanceRoute />", () => {
  describe("getInitialProps", () => {
    const context = new MockPageContext()
      .withDefaultQuery({
        slug: item.slug
      })
      .withDefaultReduxState(defaultState);

    describe("when the appearance isn't already in the store", () => {
      const slug = "new-slug";

      it("calls getInitialProps method", async () => {
        await AppearanceRoute.getInitialProps(
          context.withQuery({ slug }).toObject()
        );
      });

      it("dispatches actions.setCurrentAppearanceSlug with expected payload", () => {
        const matchingActions = context.reduxHistory.filter(
          actions.setCurrentAppearanceSlug.match
        );

        expect(matchingActions).toHaveLength(1);
        expect(matchingActions[0].payload).toBe(slug);
      });

      it("dispatches actions.fetchAppearanceBySlug.started", () => {
        expect(
          context.reduxHistory.filter(
            actions.fetchAppearanceBySlug.started.match
          )
        ).toHaveLength(1);
      });
    });

    describe("when the appearance is already in the store", () => {
      it("calls getInitialProps method", async () => {
        await AppearanceRoute.getInitialProps(context.toObject());
      });

      it("dispatches actions.setCurrentAppearanceSlug", () => {
        expect(
          context.reduxHistory.filter(actions.setCurrentAppearanceSlug.match)
        ).toHaveLength(1);
      });

      it("doesn't dispatch actions.fetchAppearanceBySlug.started", () => {
        expect(
          context.reduxHistory.filter(
            actions.fetchAppearanceBySlug.started.match
          )
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
        appearances: { isLoading: true }
      })
      .mount();

    expect(wrapper.find("Loader")).toHaveLength(1);
  });

  it("doesn't render anything when no appearance exists", () => {
    const { wrapper } = component
      .withReduxState({
        appearances: {
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
      event: "appearance.gallery.itemClick",
      index: 1
    });
  });
});
