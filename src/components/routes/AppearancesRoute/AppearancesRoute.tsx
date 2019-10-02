import cn from "classnames";
import Head from "next/head";
import * as React from "react";
import { FormattedMessage, InjectedIntlProps } from "react-intl";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import { absoluteUrl, s3ThemeUrl } from "../../../helpers/dataTransformers";
import injectIntlIntoPage from "../../../helpers/injectIntlIntoPage";
import { IAppearance } from "../../../models/root.models";
import { TStoreState } from "../../../reducers/root.reducers";
import { IPageContext } from "../../connected/App/App";
import OfflineNotice from "../../connected/OfflineNotice/OfflineNotice";
import AppearanceListing from "../../presentation/AppearanceListing/AppearanceListing";
import ButtonBar from "../../presentation/ButtonBar/ButtonBar";
import LoadButton from "../../presentation/LoadButton/LoadButton";
import NoResults from "../../presentation/NoResults/NoResults";
import PageHeader from "../../presentation/PageHeader/PageHeader";

import * as actions from "../../../actions/root.actions";
import * as selectors from "../../../selectors/root.selectors";

import "./AppearancesRoute.scss";

interface IProps extends InjectedIntlProps {
  appearancesCount: number;
  fetchAppearances: typeof actions.fetchAppearances.started;
  fetchMoreAppearances: typeof actions.fetchMoreAppearances.started;
  hasAllAppearances: boolean;
  hasError: boolean;
  isLoading: boolean;
  pastAppearances: IAppearance[];
  upcomingAppearances: IAppearance[];
}

interface IState {
  loadedListings: Record<string, boolean>;
}

class AppearancesRoute extends React.Component<IProps, IState> {
  public static async getInitialProps(context: IPageContext) {
    const { isServer, store } = context;
    const state = store.getState();

    if (isServer || selectors.getAppearancesCount(state) === 0) {
      store.dispatch(actions.fetchAppearances.started({}));
    } else if (!selectors.getHasAllAppearances(state)) {
      store.dispatch(actions.fetchMoreAppearances.started({}));
    }
  }

  public readonly state: IState = {
    loadedListings: {}
  };

  public render() {
    const {
      appearancesCount,
      hasError,
      hasAllAppearances,
      pastAppearances,
      upcomingAppearances
    } = this.props;
    const { formatMessage } = this.props.intl;

    const hasLoadedAllListings =
      appearancesCount === Object.keys(this.state.loadedListings).length;

    const isLoading = this.props.isLoading || !hasLoadedAllListings;

    const pageTitle = formatMessage({ id: "APPEARANCES_TITLE" });
    const pageDescription = formatMessage({ id: "APPEARANCES_DESCRIPTION" });

    return (
      <article className={cn("AppearancesRoute", { hasLoadedAllListings })}>
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
          <meta
            property="og:image"
            content={s3ThemeUrl("/og/appearances.jpg")}
          />
          <meta property="og:url" content={absoluteUrl("/appearances")} />
        </Head>

        <PageHeader>{pageTitle}</PageHeader>

        {hasError ? <OfflineNotice /> : null}

        {upcomingAppearances.length > 0 ? (
          <section className="AppearancesRoute--listings AppearancesRoute--upcoming">
            <h2>
              <FormattedMessage id="UPCOMING" />
            </h2>

            <div className="AppearancesRoute--listings--items">
              {upcomingAppearances.map(appearance => (
                <AppearanceListing
                  key={appearance.slug}
                  onLoad={this.onListingLoad(appearance)}
                  {...appearance}
                />
              ))}
            </div>
          </section>
        ) : null}

        {pastAppearances.length > 0 ? (
          <section className="AppearancesRoute--listings AppearancesRoute--past">
            <h2>
              <FormattedMessage id="PAST" />
            </h2>

            <div className="AppearancesRoute--listings--items">
              {pastAppearances.map(appearance => (
                <AppearanceListing key={appearance.slug} {...appearance} />
              ))}
            </div>
          </section>
        ) : null}

        {hasAllAppearances && appearancesCount === 0 ? (
          <NoResults entityIntlId="APPEARANCE" />
        ) : null}

        <ButtonBar>
          {!hasAllAppearances ? (
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

  private onListingLoad = (appearance: IAppearance) => () => {
    this.setState({
      loadedListings: {
        ...this.state.loadedListings,
        [appearance.slug]: true
      }
    });
  };

  private onLoadMore = () => {
    this.props.fetchMoreAppearances({});
  };
}

const mapState = (state: TStoreState) => ({
  appearancesCount: selectors.getAppearancesCount(state),
  hasAllAppearances: selectors.getHasAllAppearances(state),
  hasError: selectors.hasAppearancesError(state),
  isLoading: selectors.getAppearancesIsLoading(state),
  pastAppearances: selectors.getPastAppearances(state),
  upcomingAppearances: selectors.getUpcomingAppearances(state)
});

const mapActions = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      fetchAppearances: actions.fetchAppearances.started,
      fetchMoreAppearances: actions.fetchMoreAppearances.started
    },
    dispatch
  );

export default injectIntlIntoPage(
  connect(
    mapState,
    mapActions
  )(AppearancesRoute)
);
