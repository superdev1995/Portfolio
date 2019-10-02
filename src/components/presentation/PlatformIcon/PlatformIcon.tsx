import * as React from "react";
import {
  FaAmazon,
  FaApple,
  FaGoogle,
  FaSoundcloud,
  FaSpotify
} from "react-icons/fa";
import { MdPlayCircleFilled } from "react-icons/md";
import { PLATFORM } from "../../../constants/release.constants";

interface IProps {
  value: string;
}

const PlatformIcon: React.FC<IProps> = ({ value }) => {
  switch (value) {
    default:
      return <MdPlayCircleFilled />;

    case PLATFORM.AMAZON:
      return <FaAmazon />;

    case PLATFORM.APPLE:
    case PLATFORM.ITUNES:
      return <FaApple />;

    case PLATFORM.GOOGLE:
      return <FaGoogle />;

    case PLATFORM.SOUNDCLOUD:
      return <FaSoundcloud />;

    case PLATFORM.SPOTIFY:
      return <FaSpotify />;
  }
};

export default PlatformIcon;
