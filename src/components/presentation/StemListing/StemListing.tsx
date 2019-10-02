import cn from "classnames";
import * as React from "react";
import {
  FaCreativeCommons,
  FaCreativeCommonsBy,
  FaCreativeCommonsNc,
  FaCreativeCommonsSa
} from "react-icons/fa";
import { MdCloudDownload } from "react-icons/md";
import { InjectedIntlProps, injectIntl } from "react-intl";

import { IStem } from "../../../models/root.models";
import Image from "../Image/Image";
import Link from "../Link/Link";
import Meta from "../Meta/Meta";

import "./StemListing.scss";

interface IProps extends IStem, InjectedIntlProps {
  onLoad: () => void;
}

interface IState {
  isRendered: boolean;
}

class StemListing extends React.Component<IProps, IState> {
  public readonly state: IState = {
    isRendered: false
  };

  public render() {
    const { intl, onLoad, ...stem } = this.props;
    const { formatMessage } = intl;
    const { isRendered } = this.state;

    return (
      <article className={cn("StemListing", { isRendered })}>
        <Link
          className="StemListing--link"
          href={stem.url}
          isExternal={true}
          title={formatMessage(
            { id: "DOWNLOAD_STEMS_FOR" },
            { title: stem.title }
          )}
        >
          <div className="StemListing--details">
            <header className="StemListing--header">
              <h2>
                <span>{stem.title}</span>
              </h2>
            </header>

            <section className="StemListing--meta">
              <Meta
                className="StemListing--audioFormat"
                labelIntlId="AUDIO_FORMAT"
              >
                {stem.audioFormat}
              </Meta>

              <Meta
                className="StemListing--packageFormat"
                labelIntlId="PACKAGE_FORMAT"
              >
                {stem.packageFormat}, {stem.size}
              </Meta>

              <Meta
                className="StemListing--licence"
                icon={
                  <React.Fragment>
                    <FaCreativeCommons />
                    <FaCreativeCommonsBy />
                    <FaCreativeCommonsNc />
                    <FaCreativeCommonsSa />
                  </React.Fragment>
                }
                labelIntlId="LICENCED_UNDER_CC_REMIX"
                title={formatMessage({ id: "LICENCED_UNDER_CC_REMIX" })}
              />
            </section>
          </div>

          <div className="StemListing--thumbnail">
            <Image
              alt={stem.title}
              className="StemListing--image"
              onLoad={this.onLoad}
              src={stem.imageUrl}
            />

            <div className="StemListing--downloadIcon">
              <MdCloudDownload />
            </div>
          </div>
        </Link>
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

export default injectIntl(StemListing);
