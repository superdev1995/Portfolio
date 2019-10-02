import * as React from "react";

import Navigation from "../../connected/Navigation/Navigation";
import Brand from "../Brand/Brand";

import "./Banner.scss";

const Banner: React.FC = () => (
  <header className="Banner" role="banner">
    <Brand />
    <Navigation />
  </header>
);

export default Banner;
