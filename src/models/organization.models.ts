import { TYPE } from "../constants/organization.constants";

export interface IOrganization {
  readonly email?: string;
  readonly logo: string;
  readonly name: string;
  readonly type: TYPE;
}

export const organization = (
  options: Partial<IOrganization> = {}
): IOrganization => ({
  email: options.email,
  logo: options.logo || "",
  name: options.name || "",
  type: options.type || TYPE.LOCAL_BUSINESS
});
