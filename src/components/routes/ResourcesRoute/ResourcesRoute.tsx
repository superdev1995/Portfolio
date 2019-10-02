import cn from "classnames";
import Head from "next/head";
import * as React from "react";
import { FormattedMessage, InjectedIntlProps } from "react-intl";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import { absoluteUrl, s3ThemeUrl } from "../../../helpers/dataTransformers";
import injectIntlIntoPage from "../../../helpers/injectIntlIntoPage";
import { IResource } from "../../../models/root.models";
import { TStoreState } from "../../../reducers/root.reducers";
import { IPageContext } from "../../connected/App/App";
import OfflineNotice from "../../connected/OfflineNotice/OfflineNotice";
import ButtonBar from "../../presentation/ButtonBar/ButtonBar";
import LoadButton from "../../presentation/LoadButton/LoadButton";
import NoResults from "../../presentation/NoResults/NoResults";
import PageHeader from "../../presentation/PageHeader/PageHeader";
import ResourceListing from "../../presentation/ResourceListing/ResourceListing";

import * as actions from "../../../actions/root.actions";
import * as selectors from "../../../selectors/root.selectors";

import "./ResourcesRoute.scss";

interface IProps extends InjectedIntlProps {
  hasError: boolean;
  fetchMoreResources: typeof actions.fetchMoreResources.started;
  fetchResources: typeof actions.fetchResources.started;
  hasAllResources: boolean;
  isLoading: boolean;
  resources: Record<string, IResource[]>;
  resourcesCount: number;
}

interface IState {
  loadedListings: Record<string, boolean>;
}

class ResourcesRoute extends React.Component<IProps, IState> {
  public static async getInitialProps(context: IPageContext) {
    const { isServer, store } = context;

    const state = store.getState();

    if (isServer || selectors.getResourcesCount(state) === 0) {
      store.dispatch(actions.fetchResources.started({}));
    } else if (!selectors.getHasAllResources(state)) {
      store.dispatch(actions.fetchMoreResources.started({}));
    }
  }

  public readonly state: IState = {
    loadedListings: {}
  };

  public render() {
    const { hasAllResources, hasError, resources, resourcesCount } = this.props;
    const { formatMessage } = this.props.intl;

    const hasLoadedAllListings =
      resourcesCount === Object.keys(this.state.loadedListings).length;

    const isLoading = this.props.isLoading || !hasLoadedAllListings;

    const pageTitle = formatMessage({ id: "RESOURCES_TITLE" });
    const pageDescription = formatMessage({ id: "RESOURCES_DESCRIPTION" });

    return (
      <article className={cn("ResourcesRoute", { hasLoadedAllListings })}>
        <Head>
          <title>
            {pageTitle}
            {" · "}
            {formatMessage({ id: "BRAND_NAME" })}
          </title>

          <meta content={pageDescription} name="description" />

          <meta property="og:title" content={pageTitle} />
          <meta property="og:description" content={pageDescription} />
          <meta property="og:url" content={absoluteUrl("/resources")} />
          <meta property="og:type" content="website" />
          <meta property="og:image" content={s3ThemeUrl("/og/resources.jpg")} />
        </Head>

        <PageHeader>
          <FormattedMessage id="RESOURCES_TITLE" />
        </PageHeader>

        {hasError ? <OfflineNotice /> : null}

        {resourcesCount > 0
          ? Object.keys(resources).map(this.renderListingsForType)
          : null}

        {hasAllResources && resourcesCount === 0 ? (
          <NoResults entityIntlId="RESOURCE" />
        ) : null}

        <ButtonBar>
          {!hasAllResources ? (
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

  private renderListingsForType = (type: string) => (
    <section
      className={cn(
        "ResourcesRoute--listings",
        `ResourcesRoute--listings-${type}`
      )}
      key={type}
    >
      <h2>
        <FormattedMessage id={type.toUpperCase()} values={{ count: 2 }} />
      </h2>

      <p>
        <FormattedMessage id={`RESOURCES_${type.toUpperCase()}_DESCRIPTION`} />
      </p>

      <div className="ResourcesRoute--listings--items">
        {this.props.resources[type].map((resource: IResource) => (
          <ResourceListing
            {...resource}
            key={resource.slug}
            onLoad={this.onListingLoad(resource)}
          />
        ))}
      </div>
    </section>
  );

  private onListingLoad = (resource: IResource) => () => {
    this.setState({
      loadedListings: {
        ...this.state.loadedListings,
        [resource.slug]: true
      }
    });
  };

  private onLoadMore = () => {
    this.props.fetchMoreResources({});
  };
}

const mapState = (state: TStoreState) => ({
  hasAllResources: selectors.getHasAllResources(state),
  hasError: selectors.hasResourcesError(state),
  isLoading: selectors.getResourcesIsLoading(state),
  resources: selectors.getResourcesByType(state),
  resourcesCount: selectors.getResourcesCount(state)
});

const mapActions = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      fetchMoreResources: actions.fetchMoreResources.started,
      fetchResources: actions.fetchResources.started
    },
    dispatch
  );

export default injectIntlIntoPage(
  connect(
    mapState,
    mapActions
  )(ResourcesRoute)
);
