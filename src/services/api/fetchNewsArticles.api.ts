import {
  dynamoResponse,
  failure,
  IRawDynamoResponse,
  IRawNewsArticle,
  newsArticle,
  success
} from "../../models/root.models";
import { TRequest } from "../configureHttpClient";

export const fetchNewsArticles = (request: TRequest) => async (
  limit?: number,
  exclusiveStartKey?: string
) => {
  try {
    const response: IRawDynamoResponse<
      IRawNewsArticle,
      "createdAt"
    > = await request({
      params: { exclusiveStartKey, limit },
      url: `/news/find`
    });

    return success(
      dynamoResponse({
        ...response,
        items: response.items.map(newsArticle)
      })
    );
  } catch (error) {
    return failure(error);
  }
};
