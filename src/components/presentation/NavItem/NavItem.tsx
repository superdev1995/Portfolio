import cn from "classnames";
import * as React from "react";

import Link, { IProps as ILinkProps } from "../Link/Link";

interface IProps extends ILinkProps {
  isSelected?: boolean;
}

const NavItem: React.FC<IProps> = ({ children, isSelected, ...linkProps }) => (
  <li className={cn({ isSelected })}>
    {isSelected ? children : <Link {...linkProps}>{children}</Link>}
  </li>
);

NavItem.defaultProps = {
  isSelected: false
};

export default NavItem;
