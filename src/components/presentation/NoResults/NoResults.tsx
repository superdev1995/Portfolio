import cn from "classnames";
import * as React from "react";
import { FormattedMessage, InjectedIntlProps, injectIntl } from "react-intl";

import * as messages from "../../../locales/en-NZ";

import "./NoResults.scss";

interface IProps extends InjectedIntlProps {
  className?: string;
  entityIntlId: keyof typeof messages;
}

const NoResults: React.FC<IProps> = ({ className, entityIntlId, intl }) => (
  <div className={cn("NoResults", className)}>
    <FormattedMessage
      id="NO_RESULTS"
      values={{
        entities: intl
          .formatMessage({ id: entityIntlId }, { count: 2 })
          .toLowerCase()
      }}
    />
  </div>
);

export default injectIntl(NoResults);
