import * as React from "react";
import { FormattedMessage, InjectedIntlProps, injectIntl } from "react-intl";

import { STATUS } from "../../../constants/appearance.constants";

interface IProps extends InjectedIntlProps {
  value: STATUS;
}

const AppearanceStatus: React.FC<IProps> = ({ value }) => {
  switch (value) {
    case STATUS.CANCELLED:
      return <FormattedMessage id="CANCELLED" />;

    case STATUS.POSTPONED:
      return <FormattedMessage id="POSTPONED" />;

    default:
      return null;
  }
};

export default injectIntl(AppearanceStatus);
