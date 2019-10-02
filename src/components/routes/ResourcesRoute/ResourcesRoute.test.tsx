import * as actions from "../../../actions/root.actions";
import { resource } from "../../../models/root.models";
import ComponentTester from "../../../utilities/ComponentTester";
import MockPageContext from "../../../utilities/MockPageContext";
import ResourcesRoute from "./ResourcesRoute";

const item1 = resource({ slug: "test-1" });
const item2 = resource({ slug: "test-2" });

const component = new ComponentTester(ResourcesRoute, true);

describe("[routes] <ResourcesRoute />", () => {
  describe("getInitialProps", () => {
    const context = new MockPageContext();

    it("dispatches actions.fetchResources.started when rendering on the server", async () => {
      await ResourcesRoute.getInitialProps(context.toObject(true));

      expect(
        context.reduxHistory.filter(actions.fetchResources.started.match)
      ).toHaveLength(1);
    });

    it("dispatches actions.fetchResources.started when the store is empty", async () => {
      await ResourcesRoute.getInitialProps(context.toObject());

      expect(
        context.reduxHistory.filter(actions.fetchResources.started.match)
      ).toHaveLength(1);
    });

    it("dispatches actions.fetchMoreResources.started when there are more items to fetch", async () => {
      await ResourcesRoute.getInitialProps(
        context
          .withReduxState({
            resources: {
              hasAllItems: false,
              items: {
                [item1.slug]: item1
              }
            }
          })
          .toObject()
      );

      expect(
        context.reduxHistory.filter(actions.fetchMoreResources.started.match)
      ).toHaveLength(1);
    });

    it("doesn't fetch anything when all items are in the store", async () => {
      await ResourcesRoute.getInitialProps(
        context
          .withReduxState({
            resources: {
              hasAllItems: true,
              items: {
                [item1.slug]: item1
              }
            }
          })
          .toObject()
      );

      expect(
        context.reduxHistory.filter(actions.fetchResources.started.match)
      ).toHaveLength(0);
      expect(
        context.reduxHistory.filter(actions.fetchMoreResources.started.match)
      ).toHaveLength(0);
    });
  });

  describe("when all data is in the store", () => {
    const { wrapper } = component
      .withReduxState({
        resources: {
          hasAllItems: true,
          items: {
            [item1.slug]: item1,
            [item2.slug]: item2
          }
        }
      })
      .mount();

    it("renders the listings section", () => {
      expect(wrapper.find(".ResourcesRoute--listings")).toHaveLength(1);
    });

    it("renders all listings", () => {
      expect(wrapper.find("ResourceListing")).toHaveLength(2);
    });

    it("matches snapshot", () => {
      expect(wrapper.render()).toMatchSnapshot();
    });
  });

  describe("when no data is in the store", () => {
    const { wrapper } = component
      .withReduxState({
        resources: {
          hasAllItems: true,
          items: {}
        }
      })
      .mount();

    it("doesn't render the listings section", () => {
      expect(wrapper.find(".ResourcesRoute--listings")).toHaveLength(0);
    });

    it("renders the no results message", () => {
      expect(wrapper.find("NoResults")).toHaveLength(1);
    });
  });

  it("renders the offline notice when there's an error", () => {
    const { wrapper } = component
      .withReduxState({
        resources: {
          hasError: true
        }
      })
      .mount();

    expect(wrapper.find("OfflineNotice")).toHaveLength(1);
  });

  it("renders with the 'load more' button when hasAllItems is false", () => {
    const { wrapper } = component
      .withReduxState({
        resources: {
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
        resources: {
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
      component.reduxHistory.filter(actions.fetchMoreResources.started.match)
    );
  });

  it("updates `loadedListings` state after a listing has loaded", () => {
    const { wrapper } = component
      .withReduxState({
        resources: {
          items: {
            [item1.slug]: item1
          }
        }
      })
      .mount();

    // @ts-ignore-next-line
    wrapper.find("ResourceListing").prop("onLoad")();

    expect(wrapper.update().find(".hasLoadedAllListings")).toHaveLength(1);
  });
});
