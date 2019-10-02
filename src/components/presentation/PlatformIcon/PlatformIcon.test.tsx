import { PLATFORM } from "../../../constants/release.constants";
import ComponentTester from "../../../utilities/ComponentTester";
import PlatformIcon from "./PlatformIcon";

const component = new ComponentTester(PlatformIcon);

describe("[presentation] <PlatformIcon />", () => {
  it("renders the correct default icon", () => {
    const { wrapper } = component.shallow();

    expect(wrapper.find("MdPlayCircleFilled")).toHaveLength(1);
  });

  it("renders the correct icon for AMAZON", () => {
    const { wrapper } = component
      .withProps({ value: PLATFORM.AMAZON })
      .shallow();

    expect(wrapper.find("FaAmazon")).toHaveLength(1);
  });

  it("renders the correct icon for APPLE", () => {
    const { wrapper } = component
      .withProps({ value: PLATFORM.APPLE })
      .shallow();

    expect(wrapper.find("FaApple")).toHaveLength(1);
  });

  it("renders the correct icon for ITUNES", () => {
    const { wrapper } = component
      .withProps({ value: PLATFORM.ITUNES })
      .shallow();

    expect(wrapper.find("FaApple")).toHaveLength(1);
  });

  it("renders the correct icon for GOOGLE", () => {
    const { wrapper } = component
      .withProps({ value: PLATFORM.GOOGLE })
      .shallow();

    expect(wrapper.find("FaGoogle")).toHaveLength(1);
  });

  it("renders the correct icon for SOUNDCLOUD", () => {
    const { wrapper } = component
      .withProps({ value: PLATFORM.SOUNDCLOUD })
      .shallow();

    expect(wrapper.find("FaSoundcloud")).toHaveLength(1);
  });

  it("renders the correct icon for SPOTIFY", () => {
    const { wrapper } = component
      .withProps({ value: PLATFORM.SPOTIFY })
      .shallow();

    expect(wrapper.find("FaSpotify")).toHaveLength(1);
  });
});
