import * as React from "react";
import { FormattedMessage, InjectedIntlProps, injectIntl } from "react-intl";
import { connect } from "react-redux";

import { TStoreState } from "../../../reducers/root.reducers";
import * as selectors from "../../../selectors/root.selectors";

import Button from "../../presentation/Button/Button";
import Toast from "../../presentation/Toast/Toast";

interface IProps extends InjectedIntlProps {
  hasNewVersion: boolean;
}

class NewVersionToast extends React.Component<IProps> {
  public render() {
    return (
      <Toast
        className="NewVersionToast"
        hasAutoDismiss={false}
        isVisible={this.props.hasNewVersion}
      >
        <p>
          <FormattedMessage id="NEW_VERSION_AVAILABLE" />
        </p>

        <Button
          className="NewVersionToast--refreshButton"
          onClick={this.onRefreshClick}
        >
          <FormattedMessage id="REFRESH" />
        </Button>
      </Toast>
    );
  }

  private onRefreshClick = () => {
    window.location.reload(true);
  };
}

const mapState = (state: TStoreState) => ({
  hasNewVersion: selectors.hasNewVersion(state)
});

export default injectIntl(connect(mapState)(NewVersionToast));
