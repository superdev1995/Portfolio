import { TYPE } from "../constants/organization.constants";
import { organization } from "./organization.models";

describe("[models] Organization", () => {
  it("creates a valid object with defaults", () => {
    expect(organization()).toEqual({
      logo: "",
      name: "",
      type: TYPE.LOCAL_BUSINESS
    });
  });

  it("creates a valid object when all properties are defined", () => {
    const data = {
      email: "Email",
      logo: "Logo",
      name: "Name",
      type: TYPE.PERFORMER
    };

    expect(organization(data)).toEqual({
      email: data.email,
      logo: data.logo,
      name: data.name,
      type: data.type
    });
  });
});
