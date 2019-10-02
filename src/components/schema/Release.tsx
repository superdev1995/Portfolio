import * as React from "react";
import stripTags from "striptags";

import { absoluteUrl, lengthToDuration } from "../../helpers/dataTransformers";
import { IRelease, IReleaseTrack } from "../../models/root.models";
import Schema from "./Schema";

const getFlatTracklist = (tracklist: IReleaseTrack[][]) => {
  return tracklist.reduce((acc, curr) => {
    acc = [...acc, ...curr];

    return acc;
  }, []);
};

const Release: React.FC<IRelease> = props => (
  <Schema
    {...{
      "@id": absoluteUrl(`/releases/${props.slug}`),
      "@type": "MusicAlbum",
      albumProductionType: `http://schema.org/${props.productionType}`,
      albumRelease: {
        "@type": "MusicRelease",
        duration: lengthToDuration(props.length),
        name: props.title,
        recordLabel: props.recordLabel
      },
      albumReleaseType: `http://schema.org/${props.type}`,
      byArtist: {
        "@type": "MusicGroup",
        name: props.artist.name
      },
      datePublished: props.releasedOn,
      description: stripTags(props.description).replace(/\n/g, ""),
      image: props.images[0].imageUrl,
      mainEntityOfPage: {
        "@id": absoluteUrl(`/releases/${props.slug}`)
      },
      name: props.title,
      track: {
        "@type": "ItemList",
        itemListElement: getFlatTracklist(props.tracklist).map(
          (track, index) => ({
            "@type": "ListItem",
            item: {
              "@type": "MusicRecording",
              duration: lengthToDuration(track.length),
              name: track.title,
              recordingOf: {
                "@type": "MusicComposition",
                name: track.title
              }
            },
            position: index + 1
          })
        ),
        numberOfItems: getFlatTracklist(props.tracklist).length
      }
    }}
  />
);

export default Release;
