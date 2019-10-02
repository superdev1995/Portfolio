import cn from "classnames";
import * as React from "react";

import Button from "../Button/Button";
import "./Carousel.scss";

interface IProps {
  className?: string;
  currentIndex?: number;
  onSlideChange: (index: number) => void;
}

interface IState {
  currentIndex: number;
}

class Carousel extends React.Component<IProps, IState> {
  public static defaultProps = {
    currentIndex: 0
  };

  constructor(props: IProps) {
    super(props);

    this.state = {
      currentIndex: props.currentIndex || 0
    };
  }

  public componentDidUpdate(_: IProps, prevState: IState) {
    if (
      this.props.currentIndex !== undefined &&
      this.props.currentIndex !== prevState.currentIndex
    ) {
      this.setState({
        currentIndex: this.props.currentIndex
      });
    }
  }

  public render() {
    const { children, className } = this.props;

    return (
      <div className={cn("Carousel", className)}>
        <div
          className="Carousel--slides"
          style={{
            transform: `translate3d(-${this.state.currentIndex * 100}%, 0, 0)`
          }}
        >
          {children}
        </div>
        {this.renderPagination()}
      </div>
    );
  }

  private onPaginationClick = (index: number) => () => {
    this.setState({
      currentIndex: index
    });

    this.props.onSlideChange(index);
  };

  private renderPagination() {
    const { children } = this.props;

    if (!children || React.Children.count(children) < 2) {
      return null;
    }

    return (
      <div className="Carousel--pagination">
        {React.Children.map(children, (_, index) => (
          <Button
            className={cn("Carousel--pagination--page", {
              isSelected: index === this.state.currentIndex
            })}
            isStyled={false}
            onClick={this.onPaginationClick(index)}
          >
            <span>{index + 1}</span>
          </Button>
        ))}
      </div>
    );
  }
}

export default Carousel;
