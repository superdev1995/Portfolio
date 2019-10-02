import cn from "classnames";
import Head from "next/head";
import * as React from "react";
import { InjectedIntlProps } from "react-intl";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import { absoluteUrl, s3ThemeUrl } from "../../../helpers/dataTransformers";
import injectIntlIntoPage from "../../../helpers/injectIntlIntoPage";
import { IStem } from "../../../models/root.models";
import { TStoreState } from "../../../reducers/root.reducers";
import { IPageContext } from "../../connected/App/App";
import OfflineNotice from "../../connected/OfflineNotice/OfflineNotice";
import ButtonBar from "../../presentation/ButtonBar/ButtonBar";
import LoadButton from "../../presentation/LoadButton/LoadButton";
import NoResults from "../../presentation/NoResults/NoResults";
import PageHeader from "../../presentation/PageHeader/PageHeader";
import StemListing from "../../presentation/StemListing/StemListing";

import * as actions from "../../../actions/root.actions";
import * as selectors from "../../../selectors/root.selectors";

import "./StemsRoute.scss";

interface IProps extends InjectedIntlProps {
  fetchMoreStems: typeof actions.fetchMoreStems.started;
  fetchStems: typeof actions.fetchStems.started;
  hasAllStems: boolean;
  hasError: boolean;
  isLoading: boolean;
  stems: IStem[];
  stemsCount: number;
}

interface IState {
  loadedListings: Record<string, boolean>;
}

class StemsRoute extends React.Component<IProps, IState> {
  public static async getInitialProps(context: IPageContext) {
    const { isServer, store } = context;

    const state = store.getState();

    if (isServer || selectors.getStemsCount(state) === 0) {
      store.dispatch(actions.fetchStems.started({}));
    } else if (!selectors.getHasAllStems(state)) {
      store.dispatch(actions.fetchMoreStems.started({}));
    }
  }

  public readonly state: IState = {
    loadedListings: {}
  };

  public render() {
    const { hasAllStems, hasError, stems, stemsCount } = this.props;
    const { formatMessage } = this.props.intl;

    const hasLoadedAllListings =
      stemsCount === Object.keys(this.state.loadedListings).length;

    const isLoading = this.props.isLoading || !hasLoadedAllListings;

    const pageTitle = formatMessage({ id: "STEMS_TITLE" });
    const pageDescription = formatMessage({ id: "STEMS_DESCRIPTION" });

    return (
      <article className={cn("StemsRoute", { hasLoadedAllListings })}>
        <Head>
          <title>
            {pageTitle}
            {" · "}
            {formatMessage({ id: "BRAND_NAME" })}
          </title>

          <meta content={pageDescription} name="description" />
          <meta property="og:title" content={pageTitle} />
          <meta property="og:description" content={pageDescription} />
          <meta property="og:type" content="website" />
          <meta property="og:image" content={s3ThemeUrl("/og/stems.jpg")} />
          <meta property="og:url" content={absoluteUrl("/stems")} />
        </Head>

        <PageHeader>{pageTitle}</PageHeader>

        {hasError ? <OfflineNotice /> : null}

        {stemsCount < 1 ? null : (
          <section className="StemsRoute--listings">
            {stems.map(stem => (
              <StemListing
                {...stem}
                key={stem.slug}
                onLoad={this.onListingLoad(stem)}
              />
            ))}
          </section>
        )}

        {hasAllStems && stemsCount === 0 ? (
          <NoResults entityIntlId="STEM" />
        ) : null}

        <ButtonBar>
          {!hasAllStems ? (
            <LoadButton
              hasError={hasError}
              isLoading={isLoading}
              onLoad={this.onLoadMore}
            />
          ) : null}
        </ButtonBar>
      </article>
    );
  }

  private onListingLoad = (stem: IStem) => () => {
    this.setState({
      loadedListings: {
        ...this.state.loadedListings,
        [stem.slug]: true
      }
    });
  };

  private onLoadMore = () => {
    this.props.fetchMoreStems({});
  };
}

const mapState = (state: TStoreState) => ({
  hasAllStems: selectors.getHasAllStems(state),
  hasError: selectors.hasStemsError(state),
  isLoading: selectors.getStemsIsLoading(state),
  stems: selectors.getStemsAsArray(state),
  stemsCount: selectors.getStemsCount(state)
});

const mapActions = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      fetchMoreStems: actions.fetchMoreStems.started,
      fetchStems: actions.fetchStems.started
    },
    dispatch
  );

export default injectIntlIntoPage(
  connect(
    mapState,
    mapActions
  )(StemsRoute)
);
