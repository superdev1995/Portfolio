import { BOOLEAN } from "../../constants/api.constants";
import { failure, newsArticle, success } from "../../models/root.models";
import {
  mockWithRejectedPromise,
  mockWithResolvedPromise
} from "../../utilities/mocks";
import { fetchNewsArticleBySlug } from "./fetchNewsArticleBySlug.api";

describe("[api] fetchNewsArticleBySlug", () => {
  describe("when the request succeeds", () => {
    const data = {
      isActive: BOOLEAN.TRUE,
      slug: "test-1"
    };
    const request = mockWithResolvedPromise(data);
    const method = fetchNewsArticleBySlug(request);

    it("returns a success response with the model-parsed data", async () => {
      expect(await method("test-1")).toEqual(success(newsArticle(data)));
    });

    it("makes the request correctly", () => {
      expect(request).toHaveBeenCalledWith({ url: "/news/test-1" });
    });
  });

  describe("when the request fails", () => {
    const request = mockWithRejectedPromise("Fetch failed");
    const method = fetchNewsArticleBySlug(request);

    it("returns a failure response with the expected error", async () => {
      expect(await method("test-1")).toEqual(failure("Fetch failed"));
    });

    it("makes the request correctly", () => {
      expect(request).toHaveBeenCalledWith({ url: "/news/test-1" });
    });
  });
});
