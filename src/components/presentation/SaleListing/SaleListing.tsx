import * as React from "react";
import { FaTicketAlt } from "react-icons/fa";
import { MdLanguage } from "react-icons/md";

import { extractDomain } from "../../../helpers/dataTransformers";
import { IOffer } from "../../../models/offer.models";
import Link from "../Link/Link";
import Meta from "../Meta/Meta";
import Price from "../Price/Price";

import "./SaleListing.scss";

const SaleListing: React.FC<IOffer> = ({ ...sale }) => (
  <article className="SaleListing">
    <Link className="SaleListing--link" href={sale.url} isExternal={true}>
      <div className="SaleListing--icon">
        <FaTicketAlt />
      </div>

      <div className="SaleListing--details">
        <h3>
          {sale.name}:{" "}
          <Price currency={sale.priceCurrency} value={sale.price} />
        </h3>

        <section className="SaleListing--meta">
          {sale.url ? (
            <Meta
              className="SaleListing--website"
              icon={<MdLanguage />}
              labelIntlId="WEBSITE"
            >
              {extractDomain(sale.url)}
            </Meta>
          ) : null}
        </section>
      </div>
    </Link>
  </article>
);

export default SaleListing;
