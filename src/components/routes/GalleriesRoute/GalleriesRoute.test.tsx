import * as actions from "../../../actions/root.actions";
import { gallery } from "../../../models/root.models";
import ComponentTester from "../../../utilities/ComponentTester";
import MockPageContext from "../../../utilities/MockPageContext";
import GalleriesRoute from "./GalleriesRoute";

const item1 = gallery({ slug: "test-1" });
const item2 = gallery({ slug: "test-2" });

const component = new ComponentTester(GalleriesRoute, true);

describe("[routes] <GalleriesRoute />", () => {
  describe("getInitialProps", () => {
    const context = new MockPageContext();

    it("dispatches actions.fetchGalleries.started when rendering on the server", async () => {
      await GalleriesRoute.getInitialProps(context.toObject(true));

      expect(
        context.reduxHistory.filter(actions.fetchGalleries.started.match)
      ).toHaveLength(1);
    });

    it("dispatches actions.fetchGalleries.started when the store is empty", async () => {
      await GalleriesRoute.getInitialProps(context.toObject());

      expect(
        context.reduxHistory.filter(actions.fetchGalleries.started.match)
      ).toHaveLength(1);
    });

    it("dispatches actions.fetchMoreGalleries.started when there are more items to fetch", async () => {
      await GalleriesRoute.getInitialProps(
        context
          .withReduxState({
            galleries: {
              hasAllItems: false,
              items: {
                [item1.slug]: item1
              }
            }
          })
          .toObject()
      );

      expect(
        context.reduxHistory.filter(actions.fetchMoreGalleries.started.match)
      ).toHaveLength(1);
    });

    it("doesn't fetch anything when all items are in the store", async () => {
      await GalleriesRoute.getInitialProps(
        context
          .withReduxState({
            galleries: {
              hasAllItems: true,
              items: {
                [item1.slug]: item1
              }
            }
          })
          .toObject()
      );

      expect(
        context.reduxHistory.filter(actions.fetchGalleries.started.match)
      ).toHaveLength(0);
      expect(
        context.reduxHistory.filter(actions.fetchMoreGalleries.started.match)
      ).toHaveLength(0);
    });
  });

  describe("when all data is in the store", () => {
    const { wrapper } = component
      .withReduxState({
        galleries: {
          hasAllItems: true,
          items: {
            [item1.slug]: item1,
            [item2.slug]: item2
          }
        }
      })
      .mount();

    it("renders the listings section", () => {
      expect(wrapper.find(".GalleriesRoute--listings")).toHaveLength(1);
    });

    it("renders all listings", () => {
      expect(wrapper.find("GalleryListing")).toHaveLength(2);
    });

    it("matches snapshot", () => {
      expect(wrapper.render()).toMatchSnapshot();
    });
  });

  describe("when no data is in the store", () => {
    const { wrapper } = component
      .withReduxState({
        galleries: {
          hasAllItems: true,
          items: {}
        }
      })
      .mount();

    it("doesn't render the listings section", () => {
      expect(wrapper.find(".GalleriesRoute--listings")).toHaveLength(0);
    });

    it("renders the no results message", () => {
      expect(wrapper.find("NoResults")).toHaveLength(1);
    });
  });

  it("renders the offline notice when there's an error", () => {
    const { wrapper } = component
      .withReduxState({
        galleries: {
          hasError: true
        }
      })
      .mount();

    expect(wrapper.find("OfflineNotice")).toHaveLength(1);
  });

  it("renders with the 'load more' button when hasAllItems is false", () => {
    const { wrapper } = component
      .withReduxState({
        galleries: {
          hasAllItems: false,
          items: {
            [item1.slug]: item1
          }
        }
      })
      .mount();

    expect(wrapper.find("LoadButton")).toHaveLength(1);
  });

  it("renders without the 'load more' button when hasAllItems is true", () => {
    const { wrapper } = component
      .withReduxState({
        galleries: {
          hasAllItems: true
        }
      })
      .mount();

    expect(wrapper.find("LoadButton")).toHaveLength(0);
  });

  it("loads more listings when the 'load more' button is clicked", () => {
    const { wrapper } = component.mount();

    wrapper.find("LoadButton").simulate("click");

    expect(
      component.reduxHistory.filter(actions.fetchMoreGalleries.started.match)
    );
  });

  it("updates `loadedListings` state after a listing has loaded", () => {
    const { wrapper } = component
      .withReduxState({
        galleries: {
          items: {
            [item1.slug]: item1
          }
        }
      })
      .mount();

    // @ts-ignore-next-line
    wrapper.find("GalleryListing").prop("onLoad")();

    expect(wrapper.update().find(".hasLoadedAllListings")).toHaveLength(1);
  });
});
