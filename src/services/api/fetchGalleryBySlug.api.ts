import {
  failure,
  gallery,
  IRawGallery,
  success
} from "../../models/root.models";
import { TRequest } from "../configureHttpClient";

export const fetchGalleryBySlug = (request: TRequest) => async (
  slug: string
) => {
  try {
    const response: IRawGallery = await request({ url: `/galleries/${slug}` });

    return success(gallery(response));
  } catch (error) {
    return failure(error);
  }
};
