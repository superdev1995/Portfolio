import cn from "classnames";
import * as React from "react";
import {
  MdAccessTime,
  MdDateRange,
  MdFormatListNumbered,
  MdMusicNote
} from "react-icons/md";
import { FormattedMessage, InjectedIntlProps, injectIntl } from "react-intl";

import { IRelease } from "../../../models/root.models";
import Schema from "../../schema/Release";
import DateTime from "../DateTime/DateTime";
import Image from "../Image/Image";
import Link from "../Link/Link";
import Meta from "../Meta/Meta";

import "./ReleaseListing.scss";

interface IProps extends IRelease, InjectedIntlProps {
  onLoad?: () => void;
}

interface IState {
  isRendered: boolean;
}

class ReleaseListing extends React.Component<IProps, IState> {
  public state: IState = {
    isRendered: false
  };

  public render() {
    const { intl, onLoad, ...release } = this.props;
    const { isRendered } = this.state;
    const trackCount = release.tracklist.reduce(
      (acc, curr) => acc + curr.length,
      0
    );

    return (
      <article className={cn("ReleaseListing", { isRendered })}>
        <Link route={`/releases/${release.slug}`}>
          <div className="ReleaseListing--details">
            <header className="ReleaseListing--header">
              <h3>
                <span>{release.title}</span>
              </h3>
            </header>

            <section className="ReleaseListing--meta">
              <Meta
                className="ReleaseListing--releasedOn"
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
                  value={release.releasedOn}
                />
              </Meta>

              <Meta
                className="ReleaseListing--length"
                icon={<MdAccessTime />}
                labelIntlId="LENGTH"
              >
                {release.length}
              </Meta>

              <Meta
                className="ReleaseListing--genre"
                icon={<MdMusicNote />}
                labelIntlId="GENRE"
              >
                {release.genre}
              </Meta>

              <Meta
                className="ReleaseListing--tracks"
                icon={<MdFormatListNumbered />}
              >
                <FormattedMessage id="X_TRACKS" values={{ trackCount }} />
              </Meta>
            </section>
          </div>

          <Image
            className="ReleaseListing--image"
            alt={release.title}
            onLoad={this.onLoad}
            src={release.images[0].imageUrl}
          />
        </Link>

        <Schema {...release} />
      </article>
    );
  }

  private onLoad = () => {
    this.setState({
      isRendered: true
    });

    if (this.props.onLoad) {
      this.props.onLoad();
    }
  };
}

export default injectIntl(ReleaseListing);
