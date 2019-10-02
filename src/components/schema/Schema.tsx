import * as React from "react";

interface IProps {
  "@context"?: string;
  "@type"?: string;
  isPretty?: boolean;
  [index: string]: any;
}

export default class Schema extends React.Component<IProps> {
  public static defaultProps = {
    "@context": "http://schema.org/",
    "@type": "Thing",
    isPretty: false
  };

  public render() {
    const { isPretty, ...props } = this.props;

    return (
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(props, null, isPretty ? "  " : undefined)
        }}
        type="application/ld+json"
      />
    );
  }
}
