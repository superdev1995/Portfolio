import { BOOLEAN } from "../../constants/api.constants";
import {
  dynamoResponse,
  failure,
  newsArticle,
  success
} from "../../models/root.models";
import {
  mockWithRejectedPromise,
  mockWithResolvedPromise
} from "../../utilities/mocks";
import { fetchNewsArticles } from "./fetchNewsArticles.api";

describe("[api] fetchNewsArticles", () => {
  const params = {
    exclusiveStartKey: "test",
    limit: 1
  };

  describe("when the request succeeds", () => {
    const data = {
      items: [{ isActive: BOOLEAN.TRUE, slug: "test-1" }],
      lastEvaluatedKey: {
        createdAt: "2019-01-01T00:00:00",
        isActive: BOOLEAN.TRUE,
        slug: "test-0"
      }
    };
    const request = mockWithResolvedPromise(data);
    const method = fetchNewsArticles(request);

    it("returns a success response with the model-parsed data", async () => {
      expect(await method(params.limit, params.exclusiveStartKey)).toEqual(
        success(
          dynamoResponse({
            items: data.items.map(newsArticle),
            lastEvaluatedKey: data.lastEvaluatedKey
          })
        )
      );
    });

    it("makes the request correctly", () => {
      expect(request).toHaveBeenCalledWith({
        params,
        url: "/news/find"
      });
    });
  });

  describe("when the request fails", () => {
    const request = mockWithRejectedPromise("Fetch failed");
    const method = fetchNewsArticles(request);

    it("returns a failure response with the expected error", async () => {
      expect(await method(params.limit, params.exclusiveStartKey)).toEqual(
        failure("Fetch failed")
      );
    });

    it("makes the request correctly", () => {
      expect(request).toHaveBeenCalledWith({
        params,
        url: "/news/find"
      });
    });
  });
});
