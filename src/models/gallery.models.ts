import dayjs from "dayjs";

export interface IRawGallery {
  description?: string;
  imageUrl?: string;
  images?: Array<Partial<IGalleryImage>>;
  modifiedAt?: string;
  slug?: string;
  title?: string;
}

export interface IGallery {
  readonly description?: string;
  readonly imageUrl: string;
  readonly images?: IGalleryImage[];
  readonly modifiedAt: string;
  readonly slug: string;
  readonly title: string;
}

export interface IGalleryImage {
  readonly imageUrl: string;
  readonly modifiedAt: string;
}

export const galleryImage = (
  options: Partial<IGalleryImage> = {}
): IGalleryImage => ({
  imageUrl: options.imageUrl || "",
  modifiedAt: options.modifiedAt || dayjs().toISOString()
});

export const gallery = (options: IRawGallery = {}): IGallery => ({
  description: options.description,
  imageUrl: options.imageUrl || "",
  images: options.images ? options.images.map(galleryImage) : undefined,
  modifiedAt: options.modifiedAt || dayjs().toISOString(),
  slug: options.slug || "",
  title: options.title || ""
});
