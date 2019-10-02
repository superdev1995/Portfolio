import { failure, gallery, success } from "../../models/root.models";
import {
  mockWithRejectedPromise,
  mockWithResolvedPromise
} from "../../utilities/mocks";
import { fetchGalleryBySlug } from "./fetchGalleryBySlug.api";

describe("[api] fetchGalleryBySlug", () => {
  describe("when the request succeeds", () => {
    const data = {
      images: [{ imageUrl: "Image URL" }],
      slug: "test-1",
      title: "Title"
    };

    const request = mockWithResolvedPromise(data);
    const method = fetchGalleryBySlug(request);

    it("returns a success response with the model-parsed data", async () => {
      expect(await method("test-1")).toEqual(success(gallery(data)));
    });

    it("makes the request correctly", () => {
      expect(request).toHaveBeenCalledWith({ url: "/galleries/test-1" });
    });
  });

  describe("when the request fails", () => {
    const request = mockWithRejectedPromise("Fetch failed");
    const method = fetchGalleryBySlug(request);

    it("returns a failure response with the expected error", async () => {
      expect(await method("test-1")).toEqual(failure("Fetch failed"));
    });

    it("makes the request correctly", () => {
      expect(request).toHaveBeenCalledWith({ url: "/galleries/test-1" });
    });
  });
});
