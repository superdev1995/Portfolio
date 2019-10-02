import {
  dynamoResponse,
  failure,
  IRawDynamoResponse,
  IRawResource,
  resource,
  success
} from "../../models/root.models";
import { TRequest } from "../configureHttpClient";

export const fetchResources = (request: TRequest) => async (
  limit?: number,
  exclusiveStartKey?: string
) => {
  try {
    const response: IRawDynamoResponse<
      IRawResource,
      "createdAt"
    > = await request({
      params: { exclusiveStartKey, limit },
      url: `/resources/find`
    });

    return success(
      dynamoResponse({
        ...response,
        items: response.items.map(resource)
      })
    );
  } catch (error) {
    return failure(error);
  }
};
