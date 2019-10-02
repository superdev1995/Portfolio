import cn from "classnames";
import { Map } from "google-maps-react";
import * as React from "react";

import { ILatLng } from "../../../models/root.models";
import styles from "./styles.json";

interface IProps {
  className?: string;
  disableDefaultUI?: boolean;
  initialCenter: ILatLng;
  zoom?: number;
  zoomControl?: boolean;
}

const ConnectedMap: React.FC<IProps> = ({ children, className, ...props }) => (
  <div className="Map">
    <Map
      google={window.google}
      className={cn("Map-element", className)}
      styles={styles}
      {...props}
    >
      {children}
    </Map>
  </div>
);

ConnectedMap.defaultProps = {
  disableDefaultUI: true,
  zoom: 14,
  zoomControl: true
};

export default ConnectedMap;
