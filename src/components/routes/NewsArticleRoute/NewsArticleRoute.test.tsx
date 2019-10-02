import * as actions from "../../../actions/root.actions";
import { newsArticle } from "../../../models/root.models";
import ComponentTester from "../../../utilities/ComponentTester";
import MockPageContext from "../../../utilities/MockPageContext";
import NewsArticleRoute from "./NewsArticleRoute";

const item = newsArticle({ slug: "test-1" });

const defaultState = {
  news: {
    currentSlug: item.slug,
    items: {
      [item.slug]: item
    }
  }
};

const component = new ComponentTester(NewsArticleRoute, true);

describe("[routes] <NewsArticleRoute />", () => {
  describe("getInitialProps", () => {
    const context = new MockPageContext()
      .withDefaultQuery({
        slug: item.slug
      })
      .withDefaultReduxState(defaultState);

    describe("when the article isn't already in the store", () => {
      const slug = "new-slug";

      it("calls getInitialProps method", async () => {
        await NewsArticleRoute.getInitialProps(
          context.withQuery({ slug }).toObject()
        );
      });

      it("dispatches actions.setCurrentNewsArticleSlug with expected payload", () => {
        const matchingActions = context.reduxHistory.filter(
          actions.setCurrentNewsArticleSlug.match
        );

        expect(matchingActions).toHaveLength(1);
        expect(matchingActions[0].payload).toBe(slug);
      });

      it("dispatches actions.fetchNewsArticleBySlug.started", () => {
        expect(
          context.reduxHistory.filter(
            actions.fetchNewsArticleBySlug.started.match
          )
        ).toHaveLength(1);
      });
    });

    describe("when the article is already in the store", () => {
      it("calls getInitialProps method", async () => {
        await NewsArticleRoute.getInitialProps(context.toObject());
      });

      it("dispatches actions.setCurrentNewsArticleSlug", () => {
        expect(
          context.reduxHistory.filter(actions.setCurrentNewsArticleSlug.match)
        ).toHaveLength(1);
      });

      it("doesn't dispatch actions.fetchNewsArticleBySlug.started", () => {
        expect(
          context.reduxHistory.filter(
            actions.fetchNewsArticleBySlug.started.match
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
        news: { isLoading: true }
      })
      .mount();

    expect(wrapper.find("Loader")).toHaveLength(1);
  });

  it("doesn't render anything when no article exists", () => {
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
});
