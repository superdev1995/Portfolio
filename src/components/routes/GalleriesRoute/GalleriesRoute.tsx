import cn from "classnames";
import Head from "next/head";
import * as React from "react";
import { FormattedMessage, InjectedIntlProps } from "react-intl";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import * as actions from "../../../actions/root.actions";
import { absoluteUrl, s3ThemeUrl } from "../../../helpers/dataTransformers";
import injectIntlIntoPage from "../../../helpers/injectIntlIntoPage";
import { IGallery } from "../../../models/root.models";
import { TStoreState } from "../../../reducers/root.reducers";
import * as selectors from "../../../selectors/root.selectors";
import { IPageContext } from "../../connected/App/App";
import OfflineNotice from "../../connected/OfflineNotice/OfflineNotice";
import ButtonBar from "../../presentation/ButtonBar/ButtonBar";
import GalleryListing from "../../presentation/GalleryListing/GalleryListing";
import LoadButton from "../../presentation/LoadButton/LoadButton";
import NoResults from "../../presentation/NoResults/NoResults";
import PageHeader from "../../presentation/PageHeader/PageHeader";

import "./GalleriesRoute.scss";

interface IProps extends InjectedIntlProps {
  fetchGalleries: typeof actions.fetchGalleries.started;
  fetchMoreGalleries: typeof actions.fetchMoreGalleries.started;
  galleries: IGallery[];
  galleriesCount: number;
  hasAllGalleries: boolean;
  hasError: boolean;
  isLoading: boolean;
}

interface IState {
  loadedListings: Record<string, boolean>;
}

class GalleriesRoute extends React.Component<IProps, IState> {
  public static async getInitialProps(context: IPageContext) {
    const { isServer, store } = context;

    const state = store.getState();

    if (isServer || selectors.getGalleriesCount(state) === 0) {
      store.dispatch(actions.fetchGalleries.started({}));
    } else if (!selectors.getHasAllGalleries(state)) {
      store.dispatch(actions.fetchMoreGalleries.started({}));
    }
  }

  public readonly state: IState = {
    loadedListings: {}
  };

  public render() {
    const { galleries, galleriesCount, hasError, hasAllGalleries } = this.props;
    const { formatMessage } = this.props.intl;

    const hasLoadedAllListings =
      galleriesCount === Object.keys(this.state.loadedListings).length;

    const isLoading = this.props.isLoading || !hasLoadedAllListings;

    const pageTitle = formatMessage({ id: "GALLERIES_TITLE" });
    const pageDescription = formatMessage({ id: "GALLERIES_DESCRIPTION" });

    return (
      <article className={cn("GalleriesRoute", { hasLoadedAllListings })}>
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
          <meta property="og:image" content={s3ThemeUrl("/og/galleries.jpg")} />
          <meta property="og:url" content={absoluteUrl("/galleries")} />
        </Head>

        <PageHeader>
          <FormattedMessage id="GALLERIES_TITLE" />
        </PageHeader>

        {hasError ? <OfflineNotice /> : null}

        {galleriesCount > 0 ? (
          <section className="GalleriesRoute--listings">
            {galleries.map(gallery => (
              <GalleryListing
                {...gallery}
                key={gallery.slug}
                onLoad={this.onListingLoad(gallery)}
              />
            ))}
          </section>
        ) : null}

        {hasAllGalleries && galleriesCount === 0 ? (
          <NoResults entityIntlId="GALLERY" />
        ) : null}

        <ButtonBar>
          {!hasAllGalleries ? (
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

  private onListingLoad = (gallery: IGallery) => () => {
    this.setState({
      loadedListings: {
        ...this.state.loadedListings,
        [gallery.slug]: true
      }
    });
  };

  private onLoadMore = () => {
    this.props.fetchMoreGalleries({});
  };
}

const mapState = (state: TStoreState) => ({
  galleries: selectors.getGalleriesAsArray(state),
  galleriesCount: selectors.getGalleriesCount(state),
  hasAllGalleries: selectors.getHasAllGalleries(state),
  hasError: selectors.hasGalleriesError(state),
  isLoading: selectors.getGalleriesIsLoading(state)
});

const mapActions = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      fetchGalleries: actions.fetchGalleries.started,
      fetchMoreGalleries: actions.fetchMoreGalleries.started
    },
    dispatch
  );

export default injectIntlIntoPage(
  connect(
    mapState,
    mapActions
  )(GalleriesRoute)
);
