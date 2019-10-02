import { arrayToAssoc } from "../helpers/dataTransformers";

interface IWithSlug {
  slug: string;
}

export type TLastEvaluatedKey<K extends string> = Record<
  K | "isActive" | "slug",
  string
>;

export interface IRawDynamoResponse<T extends {}, K extends string> {
  items: T[];
  lastEvaluatedKey?: TLastEvaluatedKey<K>;
}

export interface IDynamoResponse<T extends IWithSlug, K extends string> {
  readonly items: Record<string, T>;
  readonly lastEvaluatedKey?: TLastEvaluatedKey<K>;
}

export interface IRawS3Response<T extends {}> {
  isTruncated?: boolean;
  items: T[];
}

export interface IS3Response<T extends IWithSlug> {
  readonly isTruncated: boolean;
  readonly items: Record<string, T>;
}

export const dynamoResponse = <T extends IWithSlug, K extends string>(
  options: IRawDynamoResponse<T, K>
): IDynamoResponse<T, K> => ({
  items: arrayToAssoc(options.items, "slug"),
  lastEvaluatedKey: options.lastEvaluatedKey
});

export const s3Response = <T extends IWithSlug>(
  options: IRawS3Response<T>
): IS3Response<T> => ({
  isTruncated: !!options.isTruncated,
  items: arrayToAssoc(options.items, "slug")
});
