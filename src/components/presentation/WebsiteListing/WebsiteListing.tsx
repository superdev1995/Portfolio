import * as React from "react";

import Link from "../Link/Link";

import "./WebsiteListing.scss";

interface IProps {
  icon?: React.ReactNode;
  title: string;
  url: string;
}

const WebsiteListing: React.FC<IProps> = ({ children, icon, title, url }) => (
  <article className="WebsiteListing">
    <Link href={url} isExternal={true} title={title}>
      {icon}
      <span className="WebsiteListing--title">{children}</span>
    </Link>
  </article>
);

export default WebsiteListing;
