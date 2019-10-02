import dayjs from "dayjs";

import * as actions from "../../../actions/root.actions";
import { appearance, newsArticle } from "../../../models/root.models";
import ComponentTester from "../../../utilities/ComponentTester";
import MockPageContext from "../../../utilities/MockPageContext";
import IndexRoute from "./IndexRoute";

const upcomingAppearance = appearance({
  finishingAt: dayjs()
    .add(4, "day")
    .toISOString(),
  slug: "upcoming-appearance",
  startingAt: dayjs()
    .add(3, "day")
    .toISOString()
});
const pastAppearance = appearance({
  finishingAt: dayjs()
    .subtract(3, "day")
    .toISOString(),
  slug: "past-appearance",
  startingAt: dayjs()
    .subtract(4, "day")
    .toISOString()
});
const newsItem = newsArticle({ slug: "news-1" });

const component = new ComponentTester(IndexRoute, true);

describe("[routes] <IndexRoute />", () => {
  describe("getInitialProps", () => {
    const context = new MockPageContext();

    it("fetches latest news and appearances when rendering on the server", async () => {
      await IndexRoute.getInitialProps(context.toObject(true));

      expect(
        context.reduxHistory.filter(actions.fetchLatestNews.started.match)
      ).toHaveLength(1);
      expect(
        context.reduxHistory.filter(actions.fetchAppearances.started.match)
      ).toHaveLength(1);
    });

    it("fetches latest news and appearances when the store is empty", async () => {
      await IndexRoute.getInitialProps(context.toObject());

      expect(
        context.reduxHistory.filter(actions.fetchLatestNews.started.match)
      ).toHaveLength(1);
      expect(
        context.reduxHistory.filter(actions.fetchAppearances.started.match)
      ).toHaveLength(1);
    });

    it("doesn't fetch latest news or appearances when all items are in the store", async () => {
      await IndexRoute.getInitialProps(
        context
          .withReduxState({
            appearances: { hasAllItems: true },
            news: { hasAllItems: true }
          })
          .toObject()
      );

      expect(
        context.reduxHistory.filter(actions.fetchLatestNews.started.match)
      ).toHaveLength(0);
      expect(
        context.reduxHistory.filter(actions.fetchAppearances.started.match)
      ).toHaveLength(0);
    });
  });

  describe("when there are news articles in the store", () => {
    const { wrapper } = component
      .withReduxState({
        news: {
          items: {
            [newsItem.slug]: newsItem
          }
        }
      })
      .mount();

    it("has the hasNewsSection class on the container", () => {
      expect(wrapper.find(".Home").hasClass("hasNewsSection")).toBe(true);
    });

    it("renders the news section", () => {
      expect(wrapper.find(".Home--news")).toHaveLength(1);
    });
  });

  describe("when there are no news articles in the store", () => {
    const { wrapper } = component.mount();

    it("doesn't have the hasNewsSection class on the container", () => {
      expect(wrapper.find(".Home").hasClass("hasNewsSection")).toBe(false);
    });

    it("doesn't render the news section", () => {
      expect(wrapper.find(".Home--news")).toHaveLength(0);
    });
  });

  describe("when there are upcoming appearances in the store", () => {
    const { wrapper } = component
      .withReduxState({
        appearances: {
          items: {
            [pastAppearance.slug]: pastAppearance,
            [upcomingAppearance.slug]: upcomingAppearance
          }
        }
      })
      .mount();

    it("has the hasAppearancesSection class on the container", () => {
      expect(wrapper.find(".Home").hasClass("hasAppearancesSection")).toBe(
        true
      );
    });

    it("renders the appearances section", () => {
      expect(wrapper.find(".Home--appearances")).toHaveLength(1);
    });
  });

  describe("when there are no upcoming appearances in the store", () => {
    const { wrapper } = component
      .withReduxState({
        appearances: {
          items: {
            [pastAppearance.slug]: pastAppearance
          }
        }
      })
      .mount();

    it("doesn't have the hasAppearancesSection class on the container", () => {
      expect(wrapper.find(".Home").hasClass("hasAppearancesSection")).toBe(
        false
      );
    });

    it("doesn't render the appearances section", () => {
      expect(wrapper.find(".Home--appearances")).toHaveLength(0);
    });
  });
});
