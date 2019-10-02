import { IncomingMessage } from "http";
import Document, {
  DocumentContext,
  DocumentProps,
  Head,
  Main,
  NextScript
} from "next/document";
import * as React from "react";

const isDev = () => process.env.NODE_ENV !== "production";

const Meta: React.FC = () => (
  <React.Fragment>
    <meta charSet="UTF-8" />
    <meta
      content="width=device-width, initial-scale=1.0, maximum-scale=5.0"
      name="viewport"
    />

    <meta property="fb:app_id" content="278225392903510" />
    <meta property="fb:page_id" content="218519344943411" />

    <link rel="manifest" href="/static/manifest.json" />

    <link
      rel="apple-touch-icon"
      sizes="180x180"
      href="/static/favicon/apple-touch-icon.png"
    />
    <link
      rel="icon"
      type="image/png"
      sizes="32x32"
      href="/static/favicon/favicon-32x32.png"
    />
    <link
      rel="icon"
      type="image/png"
      sizes="16x16"
      href="/static/favicon/favicon-16x16.png"
    />
    <link
      rel="mask-icon"
      href="/static/favicon/safari-pinned-tab.svg"
      color="#000000"
    />
    <link rel="shortcut icon" href="/static/favicon/favicon.ico" />
    <meta name="msapplication-TileColor" content="#000000" />
    <meta name="msapplication-config" content="/static/browserconfig.xml" />
    <meta name="theme-color" content="#ffffff" />
  </React.Fragment>
);

const AnalyticsHead: React.FC = () => (
  <script
    dangerouslySetInnerHTML={{
      __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl${
          isDev()
            ? `+ '&gtm_auth=5N0VfAOq-iEoyMOidFx0kQ&gtm_preview=env-3&gtm_cookies_win=x'`
            : ""
        };f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','GTM-TJZ52XC');`
    }}
  />
);

const AnalyticsBody: React.FC = () => (
  <noscript>
    <iframe
      src={`https://www.googletagmanager.com/ns.html?id=GTM-TJZ52XC${
        isDev()
          ? `&gtm_auth=5N0VfAOq-iEoyMOidFx0kQ&gtm_preview=env-3&gtm_cookies_win=x`
          : ""
      }`}
      height="0"
      width="0"
      style={{ display: "none", visibility: "hidden" }}
    />
  </noscript>
);

interface IProps extends DocumentProps {
  locale: string;
}

export default class<P extends IProps> extends Document<P> {
  public static async getInitialProps(context: DocumentContext) {
    const initialProps = await Document.getInitialProps(context);
    const props = await context.renderPage();
    const req = context.req as IncomingMessage & {
      locale: string;
    };

    return {
      ...initialProps,
      ...props,
      locale: req.locale || "en-NZ"
    };
  }

  public render() {
    return (
      <html lang={this.props.locale}>
        <Head>
          <AnalyticsHead />
          <script
            dangerouslySetInnerHTML={{
              __html: `document.documentElement.classList.add("isClientRendered");`
            }}
          />
          <script src="https://maps.googleapis.com/maps/api/js?v=3.exp&key=AIzaSyBO41slvNUu9QtGI9aNZ4RLeqBlD13y_5M" />

          <Meta />
        </Head>
        <body>
          <AnalyticsBody />
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
