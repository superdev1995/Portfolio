import cn from "classnames";
import Head from "next/head";
import * as React from "react";
import { InjectedIntlProps, injectIntl } from "react-intl";
import { connect } from "react-redux";

import Banner from "../../presentation/Banner/Banner";
import Loader from "../../presentation/Loader/Loader";
import ToastContainer from "../../presentation/ToastContainer/ToastContainer";

import { IError } from "../../../models/root.models";
import { TStoreState } from "../../../reducers/root.reducers";
import * as selectors from "../../../selectors/root.selectors";
import ErrorPage from "../../presentation/ErrorPage/ErrorPage";

import "./Page.scss";

interface IProps extends InjectedIntlProps {
  className?: string;
  error?: IError;
  isLoading: boolean;
}

class Page extends React.Component<IProps> {
  public render() {
    const { children, className, error, isLoading } = this.props;
    const { formatMessage } = this.props.intl;

    return (
      <article className={cn("Page", { isLoading }, className)}>
        <Head>
          <meta
            property="og:site_name"
            content={formatMessage({ id: "BRAND_NAME" })}
          />
        </Head>

        <Banner />

        <main className="Page--body" role="main">
          {isLoading ? (
            <Loader className="PageLoader" />
          ) : error ? (
            <ErrorPage {...error} />
          ) : (
            children
          )}
        </main>

        <ToastContainer />
      </article>
    );
  }
}

const mapState = (state: TStoreState) => ({
  error: selectors.getAppError(state),
  isLoading: selectors.isAppLoading(state)
});

export default injectIntl(connect(mapState)(Page));
