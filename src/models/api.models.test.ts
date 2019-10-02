import { dynamoResponse, s3Response } from "./api.models";

describe("[models] API", () => {
  describe("dynamoResponse", () => {
    it("creates a valid object", () => {
      const data = {
        items: [
          {
            slug: "test-1"
          }
        ],
        lastEvaluatedKey: {
          isActive: "y",
          slug: "test-1",
          test: ""
        }
      };

      expect(dynamoResponse(data)).toEqual({
        items: {
          [data.items[0].slug]: data.items[0]
        },
        lastEvaluatedKey: data.lastEvaluatedKey
      });
    });
  });

  describe("s3Response", () => {
    it("creates a valid object with defaults", () => {
      const data = {
        items: [
          {
            slug: "test-1"
          }
        ]
      };

      expect(s3Response(data)).toEqual({
        isTruncated: false,
        items: {
          [data.items[0].slug]: data.items[0]
        }
      });
    });

    it("creates a valid object when all properties are defined", () => {
      const data = {
        isTruncated: true,
        items: [
          {
            slug: "test-1"
          }
        ]
      };

      expect(s3Response(data)).toEqual({
        isTruncated: data.isTruncated,
        items: {
          [data.items[0].slug]: data.items[0]
        }
      });
    });
  });
});
