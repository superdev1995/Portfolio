import * as React from "react";
import { MdPortableWifiOff } from "react-icons/md";
import { FormattedMessage, InjectedIntlProps, injectIntl } from "react-intl";
import { connect } from "react-redux";

import { TStoreState } from "../../../reducers/root.reducers";
import * as selectors from "../../../selectors/root.selectors";

import "./OfflineNotice.scss";

interface IProps extends InjectedIntlProps {
  isOnline: boolean;
}

const OfflineNotice: React.FC<IProps> = ({ isOnline }) =>
  isOnline ? null : (
    <div className="OfflineNotice">
      <MdPortableWifiOff />
      <p>
        <FormattedMessage id="CONTENT_UNAVAILABLE_OFFLINE" />
      </p>
    </div>
  );

const mapState = (state: TStoreState) => ({
  isOnline: selectors.isOnline(state)
});

export default injectIntl(connect(mapState)(OfflineNotice));
