import { BOOLEAN } from "../../constants/api.constants";
import { failure, release, success } from "../../models/root.models";
import {
  mockWithRejectedPromise,
  mockWithResolvedPromise
} from "../../utilities/mocks";
import { fetchReleaseBySlug } from "./fetchReleaseBySlug.api";

describe("[api] fetchReleaseBySlug", () => {
  describe("when the request succeeds", () => {
    const data = {
      isActive: BOOLEAN.TRUE,
      slug: "test-1"
    };
    const request = mockWithResolvedPromise(data);
    const method = fetchReleaseBySlug(request);

    it("returns a success response with the model-parsed data", async () => {
      expect(await method("test-1")).toEqual(success(release(data)));
    });

    it("makes the request correctly", () => {
      expect(request).toHaveBeenCalledWith({ url: "/releases/test-1" });
    });
  });

  describe("when the request fails", () => {
    const request = mockWithRejectedPromise("Fetch failed");
    const method = fetchReleaseBySlug(request);

    it("returns a failure response with the expected error", async () => {
      expect(await method("test-1")).toEqual(failure("Fetch failed"));
    });

    it("makes the request correctly", () => {
      expect(request).toHaveBeenCalledWith({ url: "/releases/test-1" });
    });
  });
});
