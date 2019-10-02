import * as React from "react";

import { absoluteUrl } from "../../helpers/dataTransformers";
import { IGallery } from "../../models/root.models";
import Schema from "./Schema";

const Gallery: React.FC<IGallery> = props => (
  <Schema
    {...{
      "@id": absoluteUrl(`/galleries/${props.slug}`),
      "@type": "ImageGallery",
      associatedMedia:
        props.images && props.images.length > 0
          ? props.images.map(image => ({
              "@type": "ImageObject",
              contentUrl: image.imageUrl,
              dateModified: image.modifiedAt
            }))
          : undefined,
      dateModified: props.modifiedAt,
      description: props.description,
      name: props.title,
      primaryImageOfPage: props.imageUrl,
      thumbnailUrl: props.imageUrl
    }}
  />
);

export default Gallery;
