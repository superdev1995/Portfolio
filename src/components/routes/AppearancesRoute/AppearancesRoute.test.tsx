import dayjs from "dayjs";

import * as actions from "../../../actions/root.actions";
import { BOOLEAN } from "../../../constants/api.constants";
import { appearance } from "../../../models/root.models";
import ComponentTester from "../../../utilities/ComponentTester";
import MockPageContext from "../../../utilities/MockPageContext";
import AppearancesRoute from "./AppearancesRoute";

const pastItem1 = appearance({
  finishingAt: dayjs()
    .subtract(3, "day")
    .toISOString(),
  isActive: BOOLEAN.TRUE,
  slug: "past-1",
  startingAt: dayjs()
    .subtract(4, "day")
    .toISOString()
});
const pastItem2 = appearance({
  finishingAt: dayjs()
    .subtract(4, "day")
    .toISOString(),
  isActive: BOOLEAN.TRUE,
  slug: "past-2",
  startingAt: dayjs()
    .subtract(5, "day")
    .toISOString()
});
const upcomingItem1 = appearance({
  finishingAt: dayjs()
    .add(4, "day")
    .toISOString(),
  isActive: BOOLEAN.TRUE,
  slug: "upcoming-1",
  startingAt: dayjs()
    .add(3, "day")
    .toISOString()
});
const upcomingItem2 = appearance({
  finishingAt: dayjs()
    .add(5, "day")
    .toISOString(),
  isActive: BOOLEAN.TRUE,
  slug: "upcoming-2",
  startingAt: dayjs()
    .add(4, "day")
    .toISOString()
});

const component = new ComponentTester(AppearancesRoute, true);

describe("[routes] <AppearancesRoute />", () => {
  describe("getInitialProps", () => {
    const context = new MockPageContext();

    it("dispatches actions.fetchAppearances.started when rendering on the server", async () => {
      await AppearancesRoute.getInitialProps(context.toObject(true));

      expect(
        context.reduxHistory.filter(actions.fetchAppearances.started.match)
      ).toHaveLength(1);
    });

    it("dispatches actions.fetchAppearances.started when the store is empty", async () => {
      await AppearancesRoute.getInitialProps(context.toObject());

      expect(
        context.reduxHistory.filter(actions.fetchAppearances.started.match)
      ).toHaveLength(1);
    });

    it("dispatches actions.fetchMoreAppearances.started when there are more items to fetch", async () => {
      await AppearancesRoute.getInitialProps(
        context
          .withReduxState({
            appearances: {
              hasAllItems: false,
              items: {
                [upcomingItem1.slug]: upcomingItem1
              }
            }
          })
          .toObject()
      );

      expect(
        context.reduxHistory.filter(actions.fetchMoreAppearances.started.match)
      ).toHaveLength(1);
    });

    it("doesn't fetch anything when all items are in the store", async () => {
      await AppearancesRoute.getInitialProps(
        context
          .withReduxState({
            appearances: {
              hasAllItems: true,
              items: {
                [upcomingItem1.slug]: upcomingItem1
              }
            }
          })
          .toObject()
      );

      expect(
        context.reduxHistory.filter(actions.fetchAppearances.started.match)
      ).toHaveLength(0);
      expect(
        context.reduxHistory.filter(actions.fetchMoreAppearances.started.match)
      ).toHaveLength(0);
    });
  });

  describe("when all data is in the store", () => {
    const { wrapper } = component
      .withReduxState({
        appearances: {
          hasAllItems: true,
          items: {
            [pastItem1.slug]: pastItem1,
            [pastItem2.slug]: pastItem2,
            [upcomingItem1.slug]: upcomingItem1,
            [upcomingItem2.slug]: upcomingItem2
          }
        }
      })
      .mount();

    it("renders the upcoming section correctly", () => {
      expect(wrapper.find(".AppearancesRoute--upcoming")).toHaveLength(1);
      expect(
        wrapper.find(".AppearancesRoute--upcoming AppearanceListing")
      ).toHaveLength(2);
    });

    it("renders the past section correctly", () => {
      expect(wrapper.find(".AppearancesRoute--past")).toHaveLength(1);
      expect(
        wrapper.find(".AppearancesRoute--past AppearanceListing")
      ).toHaveLength(2);
    });

    it("matches snapshot", () => {
      expect(wrapper.render()).toMatchSnapshot();
    });
  });

  describe("when no data is in the store", () => {
    const { wrapper } = component
      .withReduxState({
        appearances: {
          hasAllItems: true,
          items: {}
        }
      })
      .mount();

    it("doesn't render the upcoming section", () => {
      expect(wrapper.find(".AppearancesRoute--upcoming")).toHaveLength(0);
    });

    it("doesn't render the past section", () => {
      expect(wrapper.find(".AppearancesRoute--past")).toHaveLength(0);
    });

    it("renders the no results message", () => {
      expect(wrapper.find("NoResults")).toHaveLength(1);
    });
  });

  it("renders the offline notice when there's an error", () => {
    const { wrapper } = component
      .withReduxState({
        appearances: {
          hasError: true
        }
      })
      .mount();

    expect(wrapper.find("OfflineNotice")).toHaveLength(1);
  });

  it("renders with the 'load more' button when hasAllItems is false", () => {
    const { wrapper } = component
      .withReduxState({
        appearances: {
          hasAllItems: false,
          items: {
            [upcomingItem1.slug]: upcomingItem1
          }
        }
      })
      .mount();

    expect(wrapper.find("LoadButton")).toHaveLength(1);
  });

  it("renders without the 'load more' button when hasAllItems is true", () => {
    const { wrapper } = component
      .withReduxState({
        appearances: {
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
      component.reduxHistory.filter(actions.fetchMoreAppearances.started.match)
    );
  });

  it("updates `loadedListings` state after a listing has loaded", () => {
    const { wrapper } = component
      .withReduxState({
        appearances: {
          items: {
            [upcomingItem1.slug]: upcomingItem1
          }
        }
      })
      .mount();

    // @ts-ignore-next-line
    wrapper.find("AppearanceListing").prop("onLoad")();

    expect(wrapper.update().find(".hasLoadedAllListings")).toHaveLength(1);
  });
});
