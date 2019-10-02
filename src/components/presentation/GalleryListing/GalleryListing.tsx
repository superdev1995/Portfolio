import cn from "classnames";
import * as React from "react";

import { IGallery } from "../../../models/root.models";
import Schema from "../../schema/Gallery";
import Image from "../Image/Image";
import Link from "../Link/Link";

import "./GalleryListing.scss";

interface IState {
  isRendered: boolean;
}

interface IProps extends IGallery {
  onLoad?: () => void;
}

export default class GalleryListing extends React.Component<IProps, IState> {
  public readonly state = {
    isRendered: false
  };

  public componentDidMount() {
    if (!this.props.imageUrl) {
      this.onLoad();
    }
  }

  public render() {
    const { onLoad, ...gallery } = this.props;
    const { isRendered } = this.state;

    return (
      <article className={cn("GalleryListing", { isRendered })}>
        <Link route={`/galleries/${gallery.slug}`}>
          <header className="GalleryListing--header">
            <h2>{gallery.title}</h2>
          </header>

          <Image
            alt={gallery.title}
            className="GalleryListing--image"
            onLoad={this.onLoad}
            src={gallery.imageUrl}
          />
        </Link>

        <Schema {...gallery} />
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
