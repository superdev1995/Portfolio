import { configureMockApi, TApi, TMockApi } from "./configureApi";

export interface IPorts {
  api: TApi;
  dataLayer: any[];
  features: string[];
  maps: {
    [index: string]: any;
  };
}

type TPortsParam = Partial<IPorts> & {
  api: TApi;
};

export interface ITestPorts {
  api: TMockApi;
  dataLayer: any[];
  features: string[];
  maps: {
    [index: string]: any;
  };
}

export interface ITestPortsParam {
  api?: Partial<TMockApi>;
  dataLayer?: any[];
  features?: string[];
  maps?: {
    [index: string]: any;
  };
}

export const configurePorts = (ports: TPortsParam): IPorts => {
  const dataLayer: any[] = ports.dataLayer || [];
  dataLayer.push = dataLayer.push.bind(dataLayer);

  return {
    api: ports.api,
    dataLayer,
    features: ports.features || [],
    maps: ports.maps || {}
  };
};

export const configureTestPorts = (ports: ITestPortsParam): ITestPorts => {
  const dataLayer: any[] = ports.dataLayer ? ports.dataLayer : [];
  const api: TMockApi = { ...configureMockApi(), ...(ports.api as any) };

  return {
    api,
    dataLayer,
    features: ports.features || [],
    maps: {
      ...window.google.maps,
      ...(ports.maps || {})
    }
  };
};
