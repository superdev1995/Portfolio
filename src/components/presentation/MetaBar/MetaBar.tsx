import cn from "classnames";
import * as React from "react";

import "./MetaBar.scss";

interface IProps {
  className?: string;
}

const MetaBar: React.FC<IProps> = ({ children, className }) =>
  !!children ? (
    <div className={cn("MetaBar", className)}>{children}</div>
  ) : null;

export default MetaBar;
