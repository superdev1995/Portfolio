import cn from "classnames";
import * as React from "react";

import "./Loader.scss";

interface IProps {
  className?: string;
}

const Loader: React.FC<IProps> = ({ className }) => (
  <span className={cn("Loader", className)}>
    <div className="Loader--animation">
      <span />
      <span />
      <span />
    </div>
  </span>
);

export default Loader;
