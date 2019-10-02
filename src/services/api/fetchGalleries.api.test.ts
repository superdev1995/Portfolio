import {
  failure,
  gallery,
  s3Response,
  success
} from "../../models/root.models";
import {
  mockWithRejectedPromise,
  mockWithResolvedPromise
} from "../../utilities/mocks";
import { fetchGalleries } from "./fetchGalleries.api";

describe("[api] fetchGalleries", () => {
  const params = {
    startAfter: "test-1"
  };

  describe("when the request succeeds", () => {
    const data = {
      isTruncated: false,
      items: [{ title: "" }]
    };
    const request = mockWithResolvedPromise(data);
    const method = fetchGalleries(request);

    it("returns a success response with the model-parsed data", async () => {
      expect(await method(params.startAfter)).toEqual(
        success(
          s3Response({
            isTruncated: data.isTruncated,
            items: data.items.map(gallery)
          })
        )
      );
    });

    it("makes the request correctly", () => {
      expect(request).toHaveBeenCalledWith({
        params,
        url: "/galleries/find"
      });
    });
  });

  describe("when the request fails", () => {
    const request = mockWithRejectedPromise("Fetch failed");
    const method = fetchGalleries(request);

    it("returns a failure response with the expected error", async () => {
      expect(await method(params.startAfter)).toEqual(failure("Fetch failed"));
    });

    it("makes the request correctly", () => {
      expect(request).toHaveBeenCalledWith({
        params,
        url: "/galleries/find"
      });
    });
  });
});
