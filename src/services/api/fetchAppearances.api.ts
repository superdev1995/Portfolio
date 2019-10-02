import {
  appearance,
  dynamoResponse,
  failure,
  IRawAppearance,
  IRawDynamoResponse,
  success
} from "../../models/root.models";
import { TRequest } from "../configureHttpClient";

export const fetchAppearances = (request: TRequest) => async (
  limit?: number,
  exclusiveStartKey?: string
) => {
  try {
    const response: IRawDynamoResponse<
      IRawAppearance,
      "startingAt"
    > = await request({
      params: { exclusiveStartKey, limit },
      url: `/appearances/find`
    });

    return success(
      dynamoResponse({
        ...response,
        items: response.items.map(appearance)
      })
    );
  } catch (error) {
    return failure(error);
  }
};
