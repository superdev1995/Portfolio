import * as React from "react";
import * as ReactDOM from "react-dom";
import { isServer } from "../../../helpers/dom";

interface IProps {
  className?: string;
  isRenderingInPlace?: boolean;
}

export default class Portal extends React.Component<IProps> {
  public static defaultProps = {
    isRenderingInPlace: false
  };

  private container: HTMLDivElement | undefined = !isServer()
    ? document.createElement("div")
    : undefined;

  public componentDidMount() {
    if (!isServer() && this.container) {
      this.container.className = `${this.props.className}`;

      const portal = this.getPortalNode();
      portal.appendChild(this.container);
    }
  }

  public componentWillUnmount() {
    if (!isServer() && this.container) {
      const portal = this.getPortalNode();
      portal.removeChild(this.container);
    }
  }

  public render() {
    if (!this.container || this.props.isRenderingInPlace) {
      return <div className="Portal--inPlace">{this.props.children}</div>;
    }

    return ReactDOM.createPortal(this.props.children, this.container);
  }

  private getPortalNode = () => {
    let portal = document.querySelector(".Portal");

    if (!portal) {
      portal = document.createElement("div");
      portal.className = "Portal";
      document.body.appendChild(portal);
    }

    return portal;
  };
}
