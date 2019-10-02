import cn from "classnames";
import * as React from "react";

import Loader from "../Loader/Loader";

import "./Button.scss";

interface IProps {
  className?: string;
  isDisabled?: boolean;
  isLoading?: boolean;
  isStyled?: boolean;
  title?: string;
  type?: "button" | "submit";
  onClick: () => void;
  nodeRef?: React.RefObject<HTMLButtonElement>;
}

export default class Button extends React.Component<IProps> {
  public static defaultProps = {
    isDisabled: false,
    isLoading: false,
    isStyled: true,
    type: "button"
  };

  public render() {
    const {
      children,
      className,
      isDisabled,
      isLoading,
      isStyled,
      onClick,
      title,
      type
    } = this.props;

    return (
      <button
        className={cn("Button", className, { isLoading }, { isStyled })}
        disabled={isDisabled}
        onClick={!isLoading ? onClick : undefined}
        ref={this.props.nodeRef}
        title={title}
        type={type}
      >
        <span className="Button--content">{children}</span>
        {isLoading ? <Loader /> : null}
      </button>
    );
  }
}
