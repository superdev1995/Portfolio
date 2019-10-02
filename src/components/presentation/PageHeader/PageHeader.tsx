import * as React from "react";

import "./PageHeader.scss";

const PageHeader: React.FC = ({ children }) => (
  <header className="PageHeader">
    <h1>{children}</h1>
  </header>
);

export default PageHeader;
