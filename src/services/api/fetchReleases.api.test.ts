import { BOOLEAN } from "../../constants/api.constants";
import {
  dynamoResponse,
  failure,
  release,
  success
} from "../../models/root.models";
import {
  mockWithRejectedPromise,
  mockWithResolvedPromise
} from "../../utilities/mocks";
import { fetchReleases } from "./fetchReleases.api";

describe("[api] fetchReleases", () => {
  const params = {
    exclusiveStartKey: "test",
    limit: 1
  };

  describe("when the request succeeds", () => {
    const data = {
      items: [{ isActive: BOOLEAN.TRUE, slug: "test-1" }],
      lastEvaluatedKey: {
        isActive: BOOLEAN.TRUE,
        releasedOn: "2019-01-01",
        slug: "test-0"
      }
    };
    const request = mockWithResolvedPromise(data);
    const method = fetchReleases(request);

    it("returns a success response with the model-parsed data", async () => {
      expect(await method(params.limit, params.exclusiveStartKey)).toEqual(
        success(
          dynamoResponse({
            items: data.items.map(release),
            lastEvaluatedKey: data.lastEvaluatedKey
          })
        )
      );
    });

    it("makes the request correctly", () => {
      expect(request).toHaveBeenCalledWith({
        params,
        url: "/releases/find"
      });
    });
  });

  describe("when the request fails", () => {
    const request = mockWithRejectedPromise("Fetch failed");
    const method = fetchReleases(request);

    it("returns a failure response with the expected error", async () => {
      expect(await method(params.limit, params.exclusiveStartKey)).toEqual(
        failure("Fetch failed")
      );
    });

    it("makes the request correctly", () => {
      expect(request).toHaveBeenCalledWith({
        params,
        url: "/releases/find"
      });
    });
  });
});
