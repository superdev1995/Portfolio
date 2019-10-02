declare module "*.json";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.png";
declare module "*.svg";

declare module "react-icon-base";
declare module "serviceworker-webpack-plugin/lib/runtime";
declare module "service-worker-mock";
declare module "google-maps-react";

// tslint:disable-next-line
interface Window {
  __NEXT_DATA__: {
    initialProps: any;
    props: any;
    page: string;
  };
  __NEXT_REDUX_STORE__: any;
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: (...args: any[]) => any;
  dataLayer: Array<{}>;
  features: string[];
  google: {
    maps: any;
    [index: string]: any;
  };
  isServer?: boolean;
  Promise: any;
}

type TCurriedReturn<T> = T extends (...args: any[]) => infer R ? R : any;

interface IGeocoderResult {
  types: string[];
  formatted_address: string;
  address_components: Array<{
    short_name: string;
    long_name: string;
    postcode_localities: string[];
    types: string[];
  }>;
  partial_match: boolean;
  place_id: string;
  postcode_localities: string[];
  geometry: {
    location: any;
    location_type: any;
    viewport: any;
    bounds: any;
  };
}
