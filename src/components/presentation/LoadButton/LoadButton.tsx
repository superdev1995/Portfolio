import cn from "classnames";
import * as React from "react";
import { FormattedMessage, InjectedIntlProps, injectIntl } from "react-intl";

import { isAlmostInViewport, isServer } from "../../../helpers/dom";
import Button from "../Button/Button";

interface IProps extends InjectedIntlProps {
  className?: string;
  hasError?: boolean;
  isDisabled?: boolean;
  isLoading?: boolean;
  isScrollLoadEnabled?: boolean;
  onLoad: () => void;
  triggerDistance?: number;
}

class LoadButton extends React.Component<IProps> {
  public static defaultProps = {
    hasError: false,
    isDisabled: false,
    isLoading: false,
    isScrollLoadEnabled: true,
    triggerDistance: 50
  };

  private buttonRef = React.createRef<HTMLButtonElement>();

  constructor(props: IProps) {
    super(props);

    if (!isServer() && props.isScrollLoadEnabled) {
      window.addEventListener("scroll", this.onWindowScroll);
    }
  }

  public componentDidMount() {
    if (!isServer()) {
      this.tryLoad();
    }
  }

  public componentDidUpdate(prevProps: IProps) {
    if (!isServer()) {
      const previouslyEnabled =
        prevProps.isScrollLoadEnabled && !prevProps.hasError;
      const shouldBeEnabled =
        this.props.isScrollLoadEnabled && !this.props.hasError;

      if (!previouslyEnabled && shouldBeEnabled) {
        window.addEventListener("scroll", this.onWindowScroll);
        this.tryLoad();
      }

      if (previouslyEnabled && !shouldBeEnabled) {
        window.removeEventListener("scroll", this.onWindowScroll);
      }
    }
  }

  public componentWillUnmount() {
    if (!isServer() && this.props.isScrollLoadEnabled && !this.props.hasError) {
      window.removeEventListener("scroll", this.onWindowScroll);
    }
  }

  public render() {
    const { children, className, hasError, isLoading, ...props } = this.props;

    return (
      <Button
        {...props}
        className={cn("LoadButton", className)}
        isLoading={isLoading}
        onClick={this.onClick}
        nodeRef={this.buttonRef}
      >
        {!!children ? (
          children
        ) : !hasError ? (
          <FormattedMessage id="LOAD_MORE" />
        ) : (
          <FormattedMessage id="TRY_AGAIN" />
        )}
      </Button>
    );
  }

  private tryLoad = () => {
    if (
      this.props.isScrollLoadEnabled &&
      !this.props.hasError &&
      !this.props.isDisabled &&
      !this.props.isLoading &&
      this.buttonRef.current &&
      isAlmostInViewport(this.buttonRef.current, this.props.triggerDistance)
    ) {
      this.props.onLoad();
    }
  };

  private onWindowScroll = () => {
    this.tryLoad();
  };

  private onClick = () => {
    this.props.onLoad();
  };
}

export default injectIntl(LoadButton);
