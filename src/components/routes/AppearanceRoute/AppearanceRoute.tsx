import Head from "next/head";
import * as React from "react";
import { InjectedIntlProps } from "react-intl";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import { absoluteUrl } from "../../../helpers/dataTransformers";
import injectIntlIntoPage from "../../../helpers/injectIntlIntoPage";
import { IAppearance, ILatLng } from "../../../models/root.models";
import { TStoreState } from "../../../reducers/root.reducers";
import { IPageContext } from "../../connected/App/App";
import Appearance from "../../presentation/Appearance/Appearance";
import Loader from "../../presentation/Loader/Loader";

import * as actions from "../../../actions/root.actions";
import * as selectors from "../../../selectors/root.selectors";

interface IProps extends InjectedIntlProps {
  appearance?: IAppearance;
  currentLocation?: ILatLng;
  fetchAppearanceBySlug: typeof actions.fetchAppearanceBySlug.started;
  geocodeCurrentAppearanceAddress: typeof actions.geocodeCurrentAppearanceAddress.started;
  isLoading: boolean;
  trackEvent: typeof actions.trackEvent;
}

class AppearanceRoute extends React.Component<IProps> {
  public static async getInitialProps(context: IPageContext) {
    const { query, store } = context;
    const slug = query.slug as string;

    store.dispatch(actions.setCurrentAppearanceSlug(slug));

    if (!selectors.getCurrentAppearance(store.getState())) {
      store.dispatch(actions.fetchAppearanceBySlug.started(slug));
    }
  }

  constructor(props: IProps) {
    super(props);

    if (props.appearance && !props.currentLocation) {
      props.geocodeCurrentAppearanceAddress({});
    }
  }

  public render() {
    const { appearance, currentLocation, isLoading } = this.props;
    const { formatMessage } = this.props.intl;

    if (isLoading) {
      return <Loader className="PageLoader" />;
    }

    if (!appearance) {
      return null;
    }

    return (
      <React.Fragment>
        <Head>
          <title>
            {appearance.title}
            {" · "}
            {formatMessage({ id: "BRAND_NAME" })}
          </title>

          <meta content={appearance.description} name="description" />

          <meta property="og:title" content={appearance.title} />
          <meta property="og:description" content={appearance.description} />
          <meta
            property="og:url"
            content={absoluteUrl(`/appearances/${appearance.slug}`)}
          />
          <meta property="og:type" content="website" />
          <meta property="og:image" content={appearance.ogImageUrl} />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
        </Head>

        <Appearance
          {...appearance}
          locationLatLng={currentLocation}
          onGalleryInteraction={this.onGalleryInteraction}
        />
      </React.Fragment>
    );
  }

  private onGalleryInteraction = (type: string, index?: number) => {
    this.props.trackEvent({
      event: `appearance.gallery.${type}`,
      index
    });
  };
}

const mapState = (state: TStoreState) => ({
  appearance: selectors.getCurrentAppearance(state),
  currentLocation: selectors.getCurrentAppearanceLocation(state),
  isLoading: selectors.getAppearancesIsLoading(state)
});

const mapActions = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      fetchAppearanceBySlug: actions.fetchAppearanceBySlug.started,
      geocodeCurrentAppearanceAddress:
        actions.geocodeCurrentAppearanceAddress.started,
      trackEvent: actions.trackEvent
    },
    dispatch
  );

export default injectIntlIntoPage(
  connect(
    mapState,
    mapActions
  )(AppearanceRoute)
);
