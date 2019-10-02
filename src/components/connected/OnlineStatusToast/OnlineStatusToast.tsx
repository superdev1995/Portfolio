import * as React from "react";
import { FormattedMessage, InjectedIntlProps, injectIntl } from "react-intl";
import { connect } from "react-redux";

import { TStoreState } from "../../../reducers/root.reducers";
import * as selectors from "../../../selectors/root.selectors";
import Toast from "../../presentation/Toast/Toast";

interface IProps extends InjectedIntlProps {
  isOnline: boolean;
}

interface IState {
  isVisible: boolean;
}

class OnlineStatusToast extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      isVisible: !props.isOnline
    };
  }

  public shouldComponentUpdate(nextProps: IProps, nextState: IState) {
    return (
      nextProps.isOnline !== this.props.isOnline ||
      nextState.isVisible !== this.state.isVisible
    );
  }

  public componentDidUpdate() {
    this.setState({
      isVisible: true
    });
  }

  public render() {
    const { isOnline } = this.props;
    const { isVisible } = this.state;

    return (
      <Toast className="OnlineStatusToast" isVisible={isVisible}>
        {isOnline ? (
          <FormattedMessage id="YOU_ARE_BACK_ONLINE" />
        ) : (
          <FormattedMessage id="YOU_ARE_OFFLINE" />
        )}
      </Toast>
    );
  }
}
const mapState = (state: TStoreState) => ({
  isOnline: selectors.isOnline(state)
});

export default injectIntl(connect(mapState)(OnlineStatusToast));
