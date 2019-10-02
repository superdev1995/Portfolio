import {
  failure,
  IRawRelease,
  release,
  success
} from "../../models/root.models";
import { TRequest } from "../configureHttpClient";

export const fetchReleaseBySlug = (request: TRequest) => async (
  slug: string
) => {
  try {
    const response: IRawRelease = await request({ url: `/releases/${slug}` });

    return success(release(response));
  } catch (error) {
    return failure(error);
  }
};
