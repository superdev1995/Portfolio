export interface IImage {
  readonly imageUrl: string;
  readonly title: string;
}

export const image = (options: Partial<IImage> = {}): IImage => ({
  imageUrl: options.imageUrl || "",
  title: options.title || ""
});
