import * as React from "react";

import Price from "../Price/Price";

interface IProps {
  currency?: string;
  max?: number;
  min?: number;
}

const PriceRange: React.FC<IProps> = ({ currency, max, min }) => (
  <React.Fragment>
    {min !== undefined ? (
      <Price className="PriceRange--min" value={min} currency={currency} />
    ) : null}
    {min !== undefined && max !== undefined ? (
      <span className="PriceRange--separator">–</span>
    ) : null}
    {max !== undefined ? (
      <Price className="PriceRange--max" value={max} currency={currency} />
    ) : null}
  </React.Fragment>
);

export default PriceRange;
