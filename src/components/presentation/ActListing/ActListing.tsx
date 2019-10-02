import cn from "classnames";
import * as React from "react";
import { MdLocationOn, MdMusicNote } from "react-icons/md";

import { IPerformer } from "../../../models/root.models";
import Image from "../Image/Image";
import Link from "../Link/Link";
import Meta from "../Meta/Meta";

import "./ActListing.scss";

interface IState {
  isRendered: boolean;
}

interface IProps extends IPerformer {
  onLoad?: () => void;
}

export default class ActListing extends React.Component<IProps, IState> {
  public readonly state: IState = {
    isRendered: false
  };

  public render() {
    const { onLoad, ...act } = this.props;
    const { isRendered } = this.state;

    return (
      <article className={cn("ActListing", { isRendered })}>
        <Link className="ActListing--link" href={act.url} isExternal={true}>
          <div className="ActListing--details">
            <h3>{act.name}</h3>

            <section className="ActListing--meta">
              <Meta
                className="ActListing--genre"
                icon={<MdMusicNote />}
                labelIntlId="GENRE"
              >
                {act.genre}
              </Meta>

              <Meta
                className="ActListing--location"
                icon={<MdLocationOn />}
                labelIntlId="LOCATION"
              >
                {act.location.name}
              </Meta>
            </section>
          </div>

          <Image
            alt={act.name}
            className="ActListing--image"
            onLoad={this.onLoad}
            src={act.imageUrl}
          />
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
