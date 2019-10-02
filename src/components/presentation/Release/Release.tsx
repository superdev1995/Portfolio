import * as React from "react";
import {
  MdAccessTime,
  MdAlbum,
  MdDateRange,
  MdFormatListNumbered,
  MdMusicNote
} from "react-icons/md";
import {
  FormattedDate,
  FormattedMessage,
  InjectedIntlProps,
  injectIntl
} from "react-intl";

import { IRelease } from "../../../models/root.models";
import Schema from "../../schema/Release";
import Carousel from "../Carousel/Carousel";
import DateTime from "../DateTime/DateTime";
import Image from "../Image/Image";
import Link from "../Link/Link";
import Meta from "../Meta/Meta";
import MetaBar from "../MetaBar/MetaBar";
import PageHeader from "../PageHeader/PageHeader";
import PlatformIcon from "../PlatformIcon/PlatformIcon";

import "./Release.scss";

interface IProps extends IRelease, InjectedIntlProps {
  onCarouselSlideChange?: (index: number) => void;
}

class Release extends React.Component<IProps> {
  public render() {
    const { intl, onCarouselSlideChange, ...release } = this.props;

    return (
      <article className="Release">
        <PageHeader>{release.title}</PageHeader>

        {this.renderMetaSection()}

        <div className="Release--body">
          {this.renderImagesSection()}

          <div className="Release--details">
            <section
              className="Release--description"
              dangerouslySetInnerHTML={{ __html: release.description }}
            />

            {this.renderTracklist()}
            {this.renderStreamList()}
            {this.renderBuyList()}

            <section className="Release--copyright">
              <p>
                ℗© <FormattedDate value={release.releasedOn} year="numeric" />{" "}
                {release.recordLabel}
              </p>
            </section>
          </div>
        </div>

        <Schema {...this.props} />
      </article>
    );
  }

  private renderMetaSection = () => {
    const { genre, length, releasedOn, tracklist, type } = this.props;
    const trackCount = tracklist.reduce((acc, curr) => acc + curr.length, 0);

    return (
      <MetaBar className="Release--meta">
        <Meta className="Release--type" icon={<MdAlbum />} labelIntlId="TYPE">
          <FormattedMessage id={type.toUpperCase()} values={{ count: 1 }} />
        </Meta>

        <Meta
          className="Release--releasedOn"
          icon={<MdDateRange />}
          labelIntlId="RELEASED"
        >
          <DateTime
            isDateOnly={true}
            isRelative={false}
            options={{
              day: "numeric",
              month: "long",
              year: "numeric"
            }}
            value={releasedOn}
          />
        </Meta>

        <Meta
          className="Release--length"
          icon={<MdAccessTime />}
          labelIntlId="LENGTH"
        >
          {length}
        </Meta>

        <Meta
          className="Release--genre"
          icon={<MdMusicNote />}
          labelIntlId="GENRE"
        >
          {genre}
        </Meta>

        <Meta className="Release--tracks" icon={<MdFormatListNumbered />}>
          <FormattedMessage id="X_TRACKS" values={{ trackCount }} />
        </Meta>
      </MetaBar>
    );
  };

  private renderImagesSection = () => (
    <section className="Release--images">
      <Carousel onSlideChange={this.onCarouselSlideChange}>
        {this.props.images.map((image, index) => (
          <Image
            alt={image.title}
            caption={image.title}
            className="Release--images--image"
            key={`image-${index}`}
            src={image.imageUrl}
          />
        ))}
      </Carousel>
    </section>
  );

  private renderTracklist = () => (
    <section className="Release--tracklist">
      <h2>
        <FormattedMessage id="TRACKLIST" />
      </h2>

      {this.props.tracklist.map((album, albumIndex) => (
        <React.Fragment key={albumIndex}>
          {this.props.tracklist.length > 1 ? (
            <h3>
              <FormattedMessage
                id="DISC_NUMBER"
                values={{ number: albumIndex }}
              />
            </h3>
          ) : null}
          <ol>
            {album.map(track => (
              <li key={track.title}>
                <span className="Release--tracklist--title">{track.title}</span>{" "}
                <span className="Release--tracklist--genre">{track.genre}</span>{" "}
                <span className="Release--tracklist--length">
                  {track.length}
                </span>
              </li>
            ))}
          </ol>
        </React.Fragment>
      ))}
    </section>
  );

  private renderStreamList = () =>
    this.props.streamList.length > 0 ? (
      <section className="Release--streamList">
        <h2>
          <FormattedMessage id="STREAM" />
        </h2>

        <ul className="Release--platformList">
          {this.props.streamList.map(link => (
            <li key={link.platform}>
              <Link
                href={link.url}
                isExternal={true}
                title={this.props.intl.formatMessage(
                  {
                    id: `STREAM_ON_PLATFORM`
                  },
                  {
                    platform: this.props.intl.formatMessage({
                      id: link.platform.toUpperCase()
                    }),
                    title: this.props.title
                  }
                )}
              >
                <PlatformIcon value={link.platform} />{" "}
                <FormattedMessage id={link.platform.toUpperCase()} />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    ) : null;

  private renderBuyList = () =>
    this.props.buyList.length > 0 ? (
      <section className="Release--buyList">
        <h2>
          <FormattedMessage id="BUY" />
        </h2>

        <ul className="Release--platformList">
          {this.props.buyList.map(link => (
            <li key={link.platform}>
              <Link
                href={link.url}
                isExternal={true}
                title={this.props.intl.formatMessage(
                  {
                    id: `BUY_FROM_PLATFORM`
                  },
                  {
                    platform: this.props.intl.formatMessage({
                      id: link.platform.toUpperCase()
                    }),
                    title: this.props.title
                  }
                )}
              >
                <PlatformIcon value={link.platform} />{" "}
                <FormattedMessage id={link.platform.toUpperCase()} />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    ) : null;

  private onCarouselSlideChange = (index: number) => {
    if (this.props.onCarouselSlideChange) {
      this.props.onCarouselSlideChange(index);
    }
  };
}

export default injectIntl(Release);
