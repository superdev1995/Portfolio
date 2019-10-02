import cn from "classnames";
import * as React from "react";

import "./ButtonBar.scss";

interface IProps {
  className?: string;
}

const ButtonBar: React.FC<IProps> = ({ children, className }) =>
  !children ? null : (
    <div className={cn("ButtonBar", className)}>{children}</div>
  );

export default ButtonBar;
