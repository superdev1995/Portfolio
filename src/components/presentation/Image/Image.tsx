import cn from "classnames";
import * as React from "react";

import Loader from "../Loader/Loader";

import "./Image.scss";

interface IProps {
  alt: string;
  caption?: string;
  className?: string;
  onClick?: () => void;
  onLoad?: () => void;
  src: string;
  title?: string;
}

interface IState {
  isRendered: boolean;
}

export default class Image extends React.Component<IProps, IState> {
  public readonly state = {
    isRendered: false
  };

  private imageRef = React.createRef<HTMLImageElement>();

  public componentDidMount() {
    if (this.imageRef.current && this.imageRef.current.complete) {
      setTimeout(this.onLoad, 1);
    }
  }

  public render() {
    const {
      alt,
      caption,
      children,
      className,
      onClick,
      src,
      title,
      ...props
    } = this.props;

    if (!src) {
      return null;
    }

    const { isRendered } = this.state;

    const clickableProps = onClick
      ? {
          onClick,
          onKeyPress: this.onKeyPress,
          role: "button",
          tabIndex: 0
        }
      : undefined;

    return (
      <figure
        className={cn(
          "Image",
          className,
          { isLoading: !isRendered },
          { isRendered }
        )}
        {...clickableProps}
        {...props}
      >
        <div className="Image--wrapper">
          <img
            src={src}
            alt={alt}
            onLoad={this.onLoad}
            ref={this.imageRef}
            title={title}
          />
          {!this.state.isRendered ? <Loader /> : null}
          {children}
        </div>
        {caption ? <figcaption>{caption}</figcaption> : null}
      </figure>
    );
  }

  private onKeyPress = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" && this.props.onClick) {
      this.props.onClick();
    }
  };

  private onLoad = () => {
    this.setState({
      isRendered: true
    });

    if (this.props.onLoad) {
      this.props.onLoad();
    }
  };
}
