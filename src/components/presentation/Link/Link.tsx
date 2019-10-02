import NextLink from "next/link";
import { withRouter } from "next/router";
import * as React from "react";

import Routes from "../../../../next.routes";

export interface IProps extends React.HTMLAttributes<HTMLAnchorElement> {
  href?: string;
  isExternal?: boolean;
  params?: {};
  prefetch?: boolean;
  route?: string;
}

class Link extends React.Component<IProps & { router: any }> {
  public static defaultProps = {
    isExternal: false,
    prefetch: false
  };

  public displayName = "Link";

  public render() {
    const {
      children,
      href,
      isExternal,
      params,
      prefetch,
      route,
      router,
      ...props
    } = this.props;

    const externalAttrs: { target?: string; rel?: string } = {};

    if (isExternal) {
      externalAttrs.target = "_blank";
      externalAttrs.rel = "noopener";
    }

    if (!href && !route) {
      return <span {...props}>{children}</span>;
    }

    if (
      !router ||
      !router.components ||
      Object.keys(router.components).length < 1
    ) {
      return (
        <a href={route ? route : href} {...externalAttrs} {...props}>
          {children}
        </a>
      );
    }

    if (route) {
      return (
        <Routes.Link route={route} params={params} prefetch={prefetch}>
          <a {...externalAttrs} {...props}>
            {children}
          </a>
        </Routes.Link>
      );
    }

    return (
      <NextLink href={href} prefetch={prefetch}>
        <a {...externalAttrs} {...props}>
          {children}
        </a>
      </NextLink>
    );
  }
}

export default withRouter(Link);
