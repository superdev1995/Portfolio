import Head from "next/head";
import * as React from "react";
import { FormattedMessage, InjectedIntlProps } from "react-intl";

import { absoluteUrl, s3ThemeUrl } from "../../../helpers/dataTransformers";
import injectIntlIntoPage from "../../../helpers/injectIntlIntoPage";
import ButtonBar from "../../presentation/ButtonBar/ButtonBar";
import Image from "../../presentation/Image/Image";
import Link from "../../presentation/Link/Link";
import PageHeader from "../../presentation/PageHeader/PageHeader";

import "./SymbolRoute.scss";

interface IProps extends InjectedIntlProps {}

class SymbolRoute extends React.Component<IProps> {
  public render() {
    const { formatMessage } = this.props.intl;

    const pageTitle = formatMessage({ id: "SYMBOL_TITLE" });
    const pageDescription = formatMessage({ id: "SYMBOL_DESCRIPTION" });

    return (
      <article className="SymbolRoute">
        <Head>
          <title>
            {pageTitle}
            {" · "}
            {formatMessage({ id: "BRAND_NAME" })}
          </title>

          <meta content={pageDescription} name="description" />
          <meta property="og:title" content={pageTitle} />
          <meta property="og:description" content={pageDescription} />
          <meta property="og:type" content="website" />
          <meta property="og:image" content={s3ThemeUrl("/og/symbol.jpg")} />
          <meta property="og:url" content={absoluteUrl("/symbol")} />
        </Head>

        <PageHeader>{pageTitle}</PageHeader>

        <section className="SymbolRoute--meaning">
          <p>
            <FormattedMessage id="SYMBOL_MEANING_CONTENT_1" />
          </p>
          <div className="SymbolRoute--symbol" />
          <p>
            <FormattedMessage id="SYMBOL_MEANING_CONTENT_2" />
          </p>
          <p>
            <FormattedMessage id="SYMBOL_MEANING_CONTENT_3" />
          </p>
          <ul>
            <li>
              <FormattedMessage id="SYMBOL_MEANING_CONTENT_4" />
            </li>
            <li>
              <FormattedMessage id="SYMBOL_MEANING_CONTENT_5" />
            </li>
            <li>
              <FormattedMessage id="SYMBOL_MEANING_CONTENT_6" />
            </li>
          </ul>
          <p>
            <FormattedMessage id="SYMBOL_MEANING_CONTENT_7" />
          </p>
          <p>
            <FormattedMessage id="SYMBOL_MEANING_CONTENT_8" />
          </p>
        </section>

        <section className="SymbolRoute--about">
          <h2>
            <FormattedMessage id="WHO_IS_VIII" />
          </h2>
          <Image
            alt="Viii"
            className="SymbolRoute-photo"
            src="https://s3.amazonaws.com/mynameisviii-static/galleries/dark-spaces-i/09.jpg"
          />
          <p>
            <FormattedMessage id="SYMBOL_ABOUT_CONTENT_1" />
          </p>
          <p>
            <FormattedMessage id="BIO_CONTENT_4" />
          </p>
          <p>
            <FormattedMessage id="SYMBOL_ABOUT_CONTENT_2" />
          </p>
          <ButtonBar>
            <Link className="Button" route="/">
              <FormattedMessage id="EXPLORE_THE_REST_OF_THE_SITE" />
            </Link>
          </ButtonBar>
        </section>
      </article>
    );
  }
}

export default injectIntlIntoPage(SymbolRoute);
