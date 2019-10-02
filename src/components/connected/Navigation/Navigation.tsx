import cn from "classnames";
import * as React from "react";
import { FormattedMessage, InjectedIntlProps, injectIntl } from "react-intl";
import { connect } from "react-redux";

import * as actions from "../../../actions/root.actions";
import { TStoreState } from "../../../reducers/root.reducers";
import * as selectors from "../../../selectors/root.selectors";
import Button from "../../presentation/Button/Button";
import NavItem from "../../presentation/NavItem/NavItem";

import "./Navigation.scss";

interface IProps extends InjectedIntlProps {
  currentRoute?: string;
  isOpen: boolean;
  setCurrentRoute: typeof actions.setCurrentRoute;
  toggleNavigation: typeof actions.toggleNavigation;
}

class Navigation extends React.Component<IProps> {
  public render() {
    return (
      <nav
        className={cn("Navigation", { isOpen: this.props.isOpen })}
        role="navigation"
      >
        <Button isStyled={false} onClick={this.onMenuButtonClick}>
          <FormattedMessage id="MENU" />
        </Button>

        <ul>
          {this.renderNavItem("/news", "NEWS_TITLE")}
          {this.renderNavItem("/releases", "RELEASES_TITLE")}
          {this.renderNavItem("/appearances", "APPEARANCES_TITLE")}
          {this.renderNavItem("/galleries", "GALLERIES_TITLE")}
          {this.renderNavItem("/stems", "STEMS_TITLE")}
          {this.renderNavItem("/resources", "RESOURCES_TITLE")}
        </ul>
      </nav>
    );
  }

  private onMenuButtonClick = () => {
    this.props.toggleNavigation();
  };

  private renderNavItem = (route: string, messageId: string) => (
    <NavItem route={route} isSelected={this.props.currentRoute === route}>
      <FormattedMessage id={messageId} />
    </NavItem>
  );
}

const mapState = (state: TStoreState) => ({
  currentRoute: selectors.getCurrentRoute(state),
  isOpen: selectors.isNavOpen(state)
});

export default injectIntl(
  connect(
    mapState,
    actions
  )(Navigation)
);
