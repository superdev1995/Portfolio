import cn from "classnames";
import * as React from "react";
import { FormattedNumber, InjectedIntlProps, injectIntl } from "react-intl";

interface IProps extends InjectedIntlProps, Intl.NumberFormatOptions {
  className?: string;
  value: number;
}

const Price: React.FC<IProps> = ({
  children,
  className,
  ...formattedNumberProps
}) => (
  <span className={cn("Price", className)}>
    <FormattedNumber style="currency" {...formattedNumberProps} />
  </span>
);

Price.defaultProps = {
  currency: "NZD",
  currencyDisplay: "symbol",
  minimumFractionDigits: 0
};

export default injectIntl(Price);
