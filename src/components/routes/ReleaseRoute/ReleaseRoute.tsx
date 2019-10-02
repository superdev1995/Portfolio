import Head from "next/head";
import * as React from "react";
import { InjectedIntlProps } from "react-intl";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import stripTags from "striptags";

import { absoluteUrl } from "../../../helpers/dataTransformers";
import injectIntlIntoPage from "../../../helpers/injectIntlIntoPage";
import { IRelease, IReleaseTrack } from "../../../models/root.models";
import { TStoreState } from "../../../reducers/root.reducers";
import { IPageContext } from "../../connected/App/App";
import Loader from "../../presentation/Loader/Loader";
import Release from "../../presentation/Release/Release";

import * as actions from "../../../actions/root.actions";
import * as selectors from "../../../selectors/root.selectors";

interface IProps extends InjectedIntlProps {
  fetchReleaseBySlug: typeof actions.fetchReleaseBySlug.started;
  isLoading: boolean;
  release?: IRelease;
  trackEvent: typeof actions.trackEvent;
}

class ReleaseRoute extends React.Component<IProps> {
  public static async getInitialProps(context: IPageContext) {
    const { query, store } = context;
    const slug = query.slug as string;

    store.dispatch(actions.setCurrentReleaseSlug(slug));

    const state = store.getState();

    if (!selectors.getCurrentRelease(state)) {
      store.dispatch(actions.fetchReleaseBySlug.started(slug));
    }
  }

  public render() {
    const { isLoading, release } = this.props;
    const { formatMessage } = this.props.intl;

    if (isLoading) {
      return <Loader className="PageLoader" />;
    }

    if (!release) {
      return null;
    }

    return (
      <React.Fragment>
        <Head>
          <title>
            {release.title}
            {" · "}
            {formatMessage({ id: "BRAND_NAME" })}
          </title>

          <meta
            content={stripTags(release.description).replace(/\n/g, "")}
            name="description"
          />

          <meta property="og:title" content={release.title} />
          <meta
            property="og:description"
            content={stripTags(release.description).replace(/\n/g, "")}
          />
          <meta
            property="og:url"
            content={absoluteUrl(`/releases/${release.slug}`)}
          />
          <meta property="og:type" content="music.album" />
          <meta property="music:release_date" content={release.releasedOn} />
          <meta property="music:musician" content={release.artist.url} />
          {release.tracklist.map(this.renderTracklistAlbumMeta)}
          <meta property="og:image" content={release.images[0].imageUrl} />
          <meta property="og:image:width" content="640" />
          <meta property="og:image:height" content="640" />
        </Head>

        <Release
          {...release}
          onCarouselSlideChange={this.onCarouselSlideChange}
        />
      </React.Fragment>
    );
  }

  private renderTracklistAlbumMeta = (
    album: IReleaseTrack[],
    albumIndex: number
  ) => (
    <React.Fragment key={albumIndex}>
      {album.map((track, trackIndex) => (
        <React.Fragment key={trackIndex}>
          <meta property="music:song" content={track.url} />
          <meta property="music:disc" content={`${albumIndex + 1}`} />
          <meta property="music:track" content={`${trackIndex + 1}`} />
        </React.Fragment>
      ))}
    </React.Fragment>
  );

  private onCarouselSlideChange = (index: number) => {
    this.props.trackEvent({
      event: "release.carousel.slideChange",
      index
    });
  };
}

const mapState = (state: TStoreState) => ({
  isLoading: selectors.getReleasesIsLoading(state),
  release: selectors.getCurrentRelease(state)
});

const mapActions = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      fetchReleaseBySlug: actions.fetchReleaseBySlug.started,
      trackEvent: actions.trackEvent
    },
    dispatch
  );

export default injectIntlIntoPage(
  connect(
    mapState,
    mapActions
  )(ReleaseRoute)
);
