import Head from "next/head";
import * as React from "react";
import { InjectedIntlProps } from "react-intl";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import { absoluteUrl } from "../../../helpers/dataTransformers";
import injectIntlIntoPage from "../../../helpers/injectIntlIntoPage";
import { IGallery } from "../../../models/root.models";
import { TStoreState } from "../../../reducers/root.reducers";
import { IPageContext } from "../../connected/App/App";
import Gallery from "../../presentation/Gallery/Gallery";
import Loader from "../../presentation/Loader/Loader";

import * as actions from "../../../actions/root.actions";
import * as selectors from "../../../selectors/root.selectors";

interface IProps extends InjectedIntlProps {
  fetchGalleryBySlug: typeof actions.fetchGalleryBySlug.started;
  gallery?: IGallery;
  isLoading: boolean;
  trackEvent: typeof actions.trackEvent;
}

class GalleryRoute extends React.Component<IProps> {
  public static async getInitialProps(context: IPageContext) {
    const { query, store } = context;
    const slug = query.slug as string;

    store.dispatch(actions.setCurrentGallerySlug(slug));

    const state = store.getState();
    const currentGallery = selectors.getCurrentGallery(state);

    if (!currentGallery || !currentGallery.images) {
      store.dispatch(actions.fetchGalleryBySlug.started(slug));
    }
  }

  public render() {
    const { gallery, isLoading } = this.props;
    const { formatMessage } = this.props.intl;

    if (isLoading) {
      return <Loader className="PageLoader" />;
    }

    if (!gallery) {
      return null;
    }

    return (
      <React.Fragment>
        <Head>
          <title>
            {gallery.title}
            {" · "}
            {formatMessage({ id: "BRAND_NAME" })}
          </title>

          <meta content={gallery.description} name="description" />

          <meta property="og:title" content={gallery.title} />
          <meta property="og:description" content={gallery.description} />
          <meta
            property="og:url"
            content={absoluteUrl(`/galleries/${gallery.slug}`)}
          />
          <meta property="og:type" content="website" />
          <meta property="og:image" content={gallery.imageUrl} />
        </Head>

        <Gallery
          {...gallery}
          onGalleryInteraction={this.onGalleryInteraction}
        />
      </React.Fragment>
    );
  }

  private onGalleryInteraction = (type: string, index?: number) => {
    this.props.trackEvent({
      event: `gallery.gallery.${type}`,
      index
    });
  };
}

const mapState = (state: TStoreState) => ({
  gallery: selectors.getCurrentGallery(state),
  isLoading: selectors.getGalleriesIsLoading(state)
});

const mapActions = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      fetchGalleryBySlug: actions.fetchGalleryBySlug.started,
      trackEvent: actions.trackEvent
    },
    dispatch
  );

export default injectIntlIntoPage(
  connect(
    mapState,
    mapActions
  )(GalleryRoute)
);
