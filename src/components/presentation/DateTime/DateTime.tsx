import cn from "classnames";
import dayjs from "dayjs";
import * as React from "react";
import {
  FormattedDate,
  FormattedRelative,
  FormattedTime,
  InjectedIntlProps,
  injectIntl
} from "react-intl";

interface IProps extends InjectedIntlProps {
  className?: string;
  isDateOnly?: boolean;
  isRelative?: boolean;
  options?: Intl.DateTimeFormatOptions;
  updateInterval?: number;
  value: Date | string | number;
}

const DateTime: React.FC<IProps> = ({
  className,
  intl,
  isDateOnly,
  isRelative,
  options,
  updateInterval,
  value,
  ...props
}) => (
  <time
    {...props}
    className={cn("DateTime", className)}
    dateTime={
      isDateOnly
        ? dayjs(value).format("YYYY-MM-DD")
        : dayjs(value).format("YYYY-MM-DDTHH:mm:ss")
    }
    title={
      isDateOnly
        ? intl.formatDate(value, options)
        : intl.formatTime(value, options)
    }
  >
    {isRelative ? (
      <FormattedRelative updateInterval={updateInterval} value={value} />
    ) : isDateOnly ? (
      <FormattedDate value={value} {...options} />
    ) : (
      <FormattedTime value={value} {...options} />
    )}
  </time>
);

DateTime.defaultProps = {
  isDateOnly: false,
  isRelative: true,
  options: {
    day: "numeric",
    month: "long",
    weekday: "long",
    year: "numeric"
  }
};

export default injectIntl(DateTime);
