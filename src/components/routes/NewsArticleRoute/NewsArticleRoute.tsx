import Head from "next/head";
import * as React from "react";
import { InjectedIntlProps } from "react-intl";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import { absoluteUrl } from "../../../helpers/dataTransformers";
import injectIntlIntoPage from "../../../helpers/injectIntlIntoPage";
import { INewsArticle } from "../../../models/root.models";
import { TStoreState } from "../../../reducers/root.reducers";
import { IPageContext } from "../../connected/App/App";
import Loader from "../../presentation/Loader/Loader";
import NewsArticle from "../../presentation/NewsArticle/NewsArticle";

import * as actions from "../../../actions/root.actions";
import * as selectors from "../../../selectors/root.selectors";

interface IProps extends InjectedIntlProps {
  article?: INewsArticle;
  fetchNewsArticleBySlug: typeof actions.fetchNewsArticleBySlug.started;
  isLoading: boolean;
}

class NewsArticleRoute extends React.Component<IProps> {
  public static async getInitialProps(context: IPageContext) {
    const { query, store } = context;
    const slug = query.slug as string;

    store.dispatch(actions.setCurrentNewsArticleSlug(slug));

    const state = store.getState();

    if (!selectors.getCurrentNewsArticle(state)) {
      store.dispatch(actions.fetchNewsArticleBySlug.started(slug));
    }
  }

  public render() {
    const { article, isLoading } = this.props;
    const { formatMessage } = this.props.intl;

    if (isLoading) {
      return <Loader className="PageLoader" />;
    }

    if (!article) {
      return null;
    }

    return (
      <React.Fragment>
        <Head>
          <title>
            {article.title}
            {" · "}
            {formatMessage({ id: "BRAND_NAME" })}
          </title>

          <meta content={article.excerpt} name="description" />

          <meta property="og:title" content={article.title} />
          <meta property="og:description" content={article.excerpt} />
          <meta
            property="og:url"
            content={absoluteUrl(`/news/${article.slug}`)}
          />
          <meta property="og:type" content="article" />
          <meta property="article:published_time" content={article.createdAt} />
          <meta property="article:author" content={article.author} />
          <meta property="og:image" content={article.ogImageUrl} />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
        </Head>

        <NewsArticle {...article} />
      </React.Fragment>
    );
  }
}

const mapState = (state: TStoreState) => ({
  article: selectors.getCurrentNewsArticle(state),
  isLoading: selectors.getNewsIsLoading(state)
});

const mapActions = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      fetchNewsArticleBySlug: actions.fetchNewsArticleBySlug.started
    },
    dispatch
  );

export default injectIntlIntoPage(
  connect(
    mapState,
    mapActions
  )(NewsArticleRoute)
);
