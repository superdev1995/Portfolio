import cn from "classnames";
import * as React from "react";
import { MdAccessTime } from "react-icons/md";
import { FormattedMessage, InjectedIntlProps, injectIntl } from "react-intl";

import { INewsArticle } from "../../../models/root.models";
import Schema from "../../schema/NewsArticle";
import ButtonBar from "../ButtonBar/ButtonBar";
import DateTime from "../DateTime/DateTime";
import Image from "../Image/Image";
import Link from "../Link/Link";
import NewsArticleType from "../NewsArticleType/NewsArticleType";
import PageHeader from "../PageHeader/PageHeader";

import "./NewsArticle.scss";

interface IProps extends INewsArticle, InjectedIntlProps {}

interface IState {
  isImageLoaded: boolean;
}

class NewsArticle extends React.Component<IProps, IState> {
  public readonly state: IState = {
    isImageLoaded: false
  };

  public render() {
    const { intl, ...article } = this.props;

    return (
      <article
        className={cn("NewsArticle", { isRendered: this.state.isImageLoaded })}
      >
        <PageHeader>{article.title}</PageHeader>

        <div className="NewsArticle--body">
          <Image
            alt={article.title}
            className="NewsArticle--image"
            onLoad={this.onImageLoad}
            src={article.imageUrl}
          />

          <section className="NewsArticle--meta">
            <div className="NewsArticle--posted">
              <MdAccessTime />{" "}
              <FormattedMessage
                id="POSTED_ON_DATE_BY_AUTHOR"
                values={{
                  author: article.author,
                  date: (
                    <DateTime
                      value={article.createdAt}
                      updateInterval={300000}
                    />
                  )
                }}
              />
            </div>

            <NewsArticleType value={article.type} />
          </section>

          <section className="NewsArticle--content">
            <div
              className="NewsArticle-content--text"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            <ButtonBar className="NewsArticle--action">
              {this.renderAction()}
            </ButtonBar>
          </section>
        </div>

        <Schema {...article} />
      </article>
    );
  }

  private renderAction = () => {
    const { action } = this.props;

    if (action && action.route) {
      return (
        <Link className="Button isStyled" route={action.route} prefetch={true}>
          {action.text}
        </Link>
      );
    }

    if (action && action.url) {
      return (
        <Link className="Button isStyled" href={action.url} isExternal={true}>
          {action.text}
        </Link>
      );
    }

    return null;
  };

  private onImageLoad = () => {
    this.setState({
      isImageLoaded: true
    });
  };
}

export default injectIntl(NewsArticle);
