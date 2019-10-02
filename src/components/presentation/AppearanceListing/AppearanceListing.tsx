import cn from "classnames";
import * as React from "react";
import { MdAccessTime, MdDateRange, MdPeople, MdPlace } from "react-icons/md";

import { STATUS } from "../../../constants/appearance.constants";
import { IAppearance } from "../../../models/root.models";
import Schema from "../../schema/Appearance";
import AppearanceStatus from "../AppearanceStatus/AppearanceStatus";
import DateTime from "../DateTime/DateTime";
import Image from "../Image/Image";
import Link from "../Link/Link";
import Meta from "../Meta/Meta";
import PriceRange from "../PriceRange/PriceRange";

import "./AppearanceListing.scss";

interface IState {
  isRendered: boolean;
}

interface IProps extends IAppearance {
  isCondensed?: boolean;
  onLoad?: () => void;
}

export default class AppearanceListing extends React.Component<IProps, IState> {
  public static defaultProps = {
    isCondensed: false
  };

  public state: IState = {
    isRendered: false
  };

  public render() {
    const { isCondensed, onLoad, ...appearance } = this.props;
    const { isRendered } = this.state;

    const currency =
      appearance.sales.length > 0
        ? appearance.sales[0].priceCurrency
        : undefined;

    return (
      <article
        className={cn(
          "AppearanceListing",
          { isRendered },
          { isCondensed },
          { isCancelled: this.isCancelled() },
          { isPostponed: this.isPostponed() },
          { isFinished: this.isFinished() }
        )}
      >
        <Link route={`/appearances/${appearance.slug}`}>
          <div className="AppearanceListing--details">
            <header className="AppearanceListing--header">
              <h3>{appearance.title}</h3>
            </header>

            <section className="AppearanceListing--meta">
              {this.renderStatus()}

              <Meta
                className="AppearanceListing--date"
                icon={<MdDateRange />}
                labelIntlId="DATE"
              >
                <DateTime
                  isDateOnly={true}
                  isRelative={false}
                  options={{
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                  }}
                  value={appearance.startingAt}
                />
              </Meta>

              <Meta
                className="AppearanceListing--time"
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
                  value={appearance.startingAt}
                />
              </Meta>

              <Meta
                className="AppearanceListing--location"
                icon={<MdPlace />}
                labelIntlId="LOCATION"
                title={`${appearance.location.name} - ${appearance.location.address}`}
              >
                {appearance.location.name}
              </Meta>

              {appearance.audience ? (
                <Meta
                  className="AppearanceListing--audience"
                  icon={<MdPeople />}
                  labelIntlId="AUDIENCE"
                >
                  {appearance.audience}
                </Meta>
              ) : null}

              <Meta className="AppearanceListing--price" labelIntlId="PRICE">
                <PriceRange currency={currency} {...this.getPriceRange()} />
              </Meta>
            </section>
          </div>

          <Image
            className="AppearanceListing--image"
            alt={appearance.title}
            onLoad={this.onLoad}
            src={appearance.imageUrl}
          />
        </Link>

        <Schema {...appearance} />
      </article>
    );
  }

  private isCancelled = () => this.props.status === STATUS.CANCELLED;
  private isPostponed = () => this.props.status === STATUS.POSTPONED;
  private isFinished = () => this.props.finishingAt < new Date().toISOString();

  private renderStatus = () => {
    if (!this.isCancelled() && !this.isPostponed()) {
      return null;
    }

    return (
      <Meta className="AppearanceListing--status" labelIntlId="STATUS">
        <AppearanceStatus value={this.props.status} />
      </Meta>
    );
  };

  private getPriceRange = () =>
    this.props.sales
      .sort((a, b) => a.price - b.price)
      .reduce<{ max?: number; min?: number }>((range, sale) => {
        if (!range.min || sale.price < range.min) {
          range.min = sale.price;
        } else if (
          (range.max && sale.price > range.max) ||
          (!range.max && range.min && sale.price > range.min)
        ) {
          range.max = sale.price;
        }

        return range;
      }, {});

  private onLoad = () => {
    this.setState({
      isRendered: true
    });

    if (this.props.onLoad) {
      this.props.onLoad();
    }
  };
}
