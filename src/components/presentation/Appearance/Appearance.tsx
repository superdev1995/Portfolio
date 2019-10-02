import cn from "classnames";
import { Marker } from "google-maps-react";
import * as React from "react";
import { FaFacebookSquare } from "react-icons/fa";
import { MdAccessTime, MdDateRange, MdPeople, MdPlace } from "react-icons/md";
import { FormattedMessage, InjectedIntlProps, injectIntl } from "react-intl";

import { STATUS } from "../../../constants/appearance.constants";
import { IAppearance, ILatLng } from "../../../models/root.models";
import Schema from "../../schema/Appearance";
import ActListing from "../ActListing/ActListing";
import AppearanceStatus from "../AppearanceStatus/AppearanceStatus";
import DateTime from "../DateTime/DateTime";
import Image from "../Image/Image";
import ImageGallery from "../ImageGallery/ImageGallery";
import Link from "../Link/Link";
import Map from "../Map/Map";
import Meta from "../Meta/Meta";
import MetaBar from "../MetaBar/MetaBar";
import PageHeader from "../PageHeader/PageHeader";
import SaleListing from "../SaleListing/SaleListing";

import "./Appearance.scss";

interface IProps extends IAppearance, InjectedIntlProps {
  locationLatLng?: ILatLng;
  onGalleryInteraction?: (type: string, index?: number) => void;
}

class Appearance extends React.Component<IProps> {
  public render() {
    const {
      intl,
      locationLatLng,
      onGalleryInteraction,
      ...appearance
    } = this.props;

    return (
      <article
        className={cn(
          "Appearance",
          { isCancelled: this.isCancelled() },
          { isPostponed: this.isPostponed() },
          { isFinished: this.isFinished() }
        )}
      >
        <PageHeader>{appearance.title}</PageHeader>

        {this.renderMetaSection()}

        <div className="Appearance--body">
          {this.renderImage()}

          <div className="Appearance--details">
            <section className="Appearance--description">
              <p>{appearance.description}</p>
            </section>

            {this.renderRsvpSection()}
            {this.renderActsSection()}
            {this.renderTicketsSection()}
          </div>

          {this.renderImagesSection()}
          {this.renderMapSection()}
        </div>

        <Schema {...appearance} />
      </article>
    );
  }

  private isCancelled = () => this.props.status === STATUS.CANCELLED;
  private isPostponed = () => this.props.status === STATUS.POSTPONED;
  private isFinished = () => this.props.finishingAt < new Date().toISOString();

  private renderMetaSection = () => {
    const { audience, finishingAt, location, startingAt } = this.props;

    return (
      <MetaBar className="Appearance--meta">
        <Meta
          className="Appearance--date"
          icon={<MdDateRange />}
          labelIntlId="DATE"
        >
          <DateTime
            isDateOnly={true}
            isRelative={false}
            options={{
              day: "numeric",
              month: "long",
              weekday: "long",
              year: "numeric"
            }}
            value={startingAt}
          />
        </Meta>

        <Meta
          className="Appearance--time"
          icon={<MdAccessTime />}
          labelIntlId="TIME"
        >
          <DateTime
            isRelative={false}
            options={{
              hour: "numeric",
              hour12: true,
              minute: "numeric"
            }}
            value={startingAt}
          />
          –
          <DateTime
            isRelative={false}
            options={{
              hour: "numeric",
              hour12: true,
              minute: "numeric"
            }}
            value={finishingAt}
          />
        </Meta>

        <Meta
          className="Appearance--location"
          icon={<MdPlace />}
          labelIntlId="LOCATION"
          title={`${location.name} - ${location.address}`}
        >
          {location.name}
        </Meta>

        {audience ? (
          <Meta
            className="Appearance--audience"
            icon={<MdPeople />}
            labelIntlId="AUDIENCE"
          >
            {audience}
          </Meta>
        ) : null}
      </MetaBar>
    );
  };

  private renderStatus = () => {
    if (!this.isCancelled() && !this.isPostponed()) {
      return null;
    }

    return (
      <Meta className="Appearance--status" labelIntlId="STATUS">
        <AppearanceStatus value={this.props.status} />
      </Meta>
    );
  };

  private renderImage = () => (
    <Image
      alt={this.props.title}
      className="Appearance--image"
      src={this.props.imageUrl}
    >
      {this.renderStatus()}
    </Image>
  );

  private renderRsvpSection = () => {
    if (this.isFinished() || !this.props.rsvpUrl) {
      return null;
    }

    return (
      <section className="Appearance--rsvp">
        <Link
          className="Appearance--rsvpLink Button"
          href={this.props.rsvpUrl}
          isExternal={true}
        >
          <FaFacebookSquare /> <FormattedMessage id="RSVP_ON_FACEBOOK" />
        </Link>
      </section>
    );
  };

  private renderActsSection = () => (
    <section className="Appearance--acts">
      <h2>
        <FormattedMessage id="FEATURED_ACTS" />
      </h2>

      <div className="Appearance--acts--items">
        {this.props.acts.map(act => (
          <ActListing key={act.name} {...act} />
        ))}
      </div>
    </section>
  );

  private renderTicketsSection = () => {
    const { sales } = this.props;

    if (
      sales.length < 1 ||
      this.isCancelled() ||
      this.isPostponed() ||
      this.isFinished()
    ) {
      return null;
    }

    return (
      <section className="Appearance--tickets">
        <h2>
          <FormattedMessage id="GET_TICKETS" />
        </h2>

        <div className="Appearance--tickets--items">
          {sales.map(sale => (
            <SaleListing key={sale.name} {...sale} />
          ))}
        </div>
      </section>
    );
  };

  private renderImagesSection = () => {
    const { images } = this.props;

    if (images.length < 1) {
      return null;
    }

    return (
      <section className="Appearance--images">
        <h2>
          <FormattedMessage id="PHOTOS" />
        </h2>

        <ImageGallery
          className="Appearance--images--items"
          onItemClick={this.onGalleryInteraction("itemClick")}
          onNext={this.onGalleryInteraction("next")}
          onPrevious={this.onGalleryInteraction("previous")}
          onModalClose={this.onGalleryInteraction("modalClose")}
        >
          {images.map(image => (
            <Image
              alt={image.title}
              caption={image.title}
              key={image.imageUrl}
              src={image.imageUrl}
            />
          ))}
        </ImageGallery>
      </section>
    );
  };

  private renderMapSection = () =>
    !!this.props.locationLatLng ? (
      <section className="Appearance--map">
        <h2>
          <FormattedMessage id="LOCATION" />
        </h2>

        <Map
          className="Appearance--map--googleMap"
          initialCenter={this.props.locationLatLng}
        >
          <Marker position={this.props.locationLatLng} />
        </Map>
      </section>
    ) : null;

  private onGalleryInteraction = (type: string) => (index?: number) => {
    if (this.props.onGalleryInteraction) {
      this.props.onGalleryInteraction(type, index);
    }
  };
}

export default injectIntl(Appearance);
