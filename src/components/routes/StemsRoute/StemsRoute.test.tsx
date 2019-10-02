import * as actions from "../../../actions/root.actions";
import { stem } from "../../../models/root.models";
import ComponentTester from "../../../utilities/ComponentTester";
import MockPageContext from "../../../utilities/MockPageContext";
import StemsRoute from "./StemsRoute";

const item1 = stem({ slug: "test-1" });
const item2 = stem({ slug: "test-2" });

const component = new ComponentTester(StemsRoute, true);

describe("[routes] <StemsRoute />", () => {
  describe("getInitialProps", () => {
    const context = new MockPageContext();

    it("dispatches actions.fetchStems.started when rendering on the server", async () => {
      await StemsRoute.getInitialProps(context.toObject(true));

      expect(
        context.reduxHistory.filter(actions.fetchStems.started.match)
      ).toHaveLength(1);
    });

    it("dispatches actions.fetchStems.started when the store is empty", async () => {
      await StemsRoute.getInitialProps(context.toObject());

      expect(
        context.reduxHistory.filter(actions.fetchStems.started.match)
      ).toHaveLength(1);
    });

    it("dispatches actions.fetchMoreStems.started when there are more items to fetch", async () => {
      await StemsRoute.getInitialProps(
        context
          .withReduxState({
            stems: {
              hasAllItems: false,
              items: {
                [item1.slug]: item1
              }
            }
          })
          .toObject()
      );

      expect(
        context.reduxHistory.filter(actions.fetchMoreStems.started.match)
      ).toHaveLength(1);
    });

    it("doesn't fetch anything when all items are in the store", async () => {
      await StemsRoute.getInitialProps(
        context
          .withReduxState({
            stems: {
              hasAllItems: true,
              items: {
                [item1.slug]: item1
              }
            }
          })
          .toObject()
      );

      expect(
        context.reduxHistory.filter(actions.fetchStems.started.match)
      ).toHaveLength(0);
      expect(
        context.reduxHistory.filter(actions.fetchMoreStems.started.match)
      ).toHaveLength(0);
    });
  });

  describe("when all data is in the store", () => {
    const { wrapper } = component
      .withReduxState({
        stems: {
          hasAllItems: true,
          items: {
            [item1.slug]: item1,
            [item2.slug]: item2
          }
        }
      })
      .mount();

    it("renders the listings section", () => {
      expect(wrapper.find(".StemsRoute--listings")).toHaveLength(1);
    });

    it("renders all listings", () => {
      expect(wrapper.find("StemListing")).toHaveLength(2);
    });

    it("matches snapshot", () => {
      expect(wrapper.render()).toMatchSnapshot();
    });
  });

  describe("when no data is in the store", () => {
    const { wrapper } = component
      .withReduxState({
        stems: {
          hasAllItems: true,
          items: {}
        }
      })
      .mount();

    it("doesn't render the listings section", () => {
      expect(wrapper.find(".StemsRoute--listings")).toHaveLength(0);
    });

    it("renders the no results message", () => {
      expect(wrapper.find("NoResults")).toHaveLength(1);
    });
  });

  it("renders the offline notice when there's an error", () => {
    const { wrapper } = component
      .withReduxState({
        stems: {
          hasError: true
        }
      })
      .mount();

    expect(wrapper.find("OfflineNotice")).toHaveLength(1);
  });

  it("renders with the 'load more' button when hasAllItems is false", () => {
    const { wrapper } = component
      .withReduxState({
        stems: {
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
        stems: {
          hasAllItems: true
        }
      })
      .mount();

    expect(wrapper.find("LoadButton")).toHaveLength(0);
  });

  it("loads more listings when the 'load more' button is clicked", () => {
    const { wrapper } = component.mount();

    wrapper.find("LoadButton").simulate("click");

    expect(component.reduxHistory.filter(actions.fetchMoreStems.started.match));
  });

  it("updates `loadedListings` state after a listing has loaded", () => {
    const { wrapper } = component
      .withReduxState({
        stems: {
          items: {
            [item1.slug]: item1
          }
        }
      })
      .mount();

    // @ts-ignore-next-line
    wrapper.find("StemListing").prop("onLoad")();

    expect(wrapper.update().find(".hasLoadedAllListings")).toHaveLength(1);
  });
});
