import cn from "classnames";
import * as React from "react";
import { MdAlbum, MdEvent, MdNewReleases } from "react-icons/md";
import { InjectedIntlProps, injectIntl } from "react-intl";
import { TYPE } from "../../../constants/news.constants";

interface IProps extends InjectedIntlProps {
  className?: string;
  hasLabel?: boolean;
  value: string;
}

const NewsArticleType: React.FC<IProps> = ({
  className,
  hasLabel,
  intl,
  value,
  ...props
}) => {
  let icon;
  let label;

  switch (value) {
    case TYPE.RELEASE:
      icon = <MdAlbum />;
      label = intl.formatMessage({ id: "RELEASE" }, { count: 1 });
      break;

    case TYPE.APPEARANCE:
      icon = <MdEvent />;
      label = intl.formatMessage({ id: "APPEARANCE" }, { count: 1 });
      break;

    default:
      icon = <MdNewReleases />;
      label = intl.formatMessage({ id: "NEWS" });
      break;
  }

  return (
    <div
      className={cn("NewsArticleType", `NewsArticleType-${value}`, className)}
      title={!hasLabel ? label : undefined}
      {...props}
    >
      {icon}
      {hasLabel ? " " : null}
      {hasLabel ? (
        <span className="NewsArticleType--label">{label}</span>
      ) : null}
    </div>
  );
};

NewsArticleType.defaultProps = {
  hasLabel: true
};

export default injectIntl(NewsArticleType);
