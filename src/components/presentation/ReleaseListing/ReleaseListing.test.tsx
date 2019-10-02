import { release } from "../../../models/root.models";
import ComponentTester from "../../../utilities/ComponentTester";
import ReleaseListing from "./ReleaseListing";

const component = new ComponentTester(ReleaseListing).withDefaultProps(
  release({
    artist: {
      name: "Artist Name",
      url: "URL"
    },
    buyList: [],
    description: "Description",
    genre: "Genre",
    images: [
      {
        imageUrl: "Image URL",
        title: "Image title"
      }
    ],
    length: "5:00",
    recordLabel: "Record Label",
    releasedOn: "2017-01-01T00:00:00",
    slug: "release-1",
    streamList: [],
    title: "Title",
    tracklist: [
      [
        {
          genre: "Genre",
          length: "5:00",
          title: "Title",
          url: "URL"
        }
      ]
    ]
  })
);

describe("[presentation] <ReleaseListing />", () => {
  const { props, wrapper } = component
    .withProps({
      onLoad: jest.fn()
    })
    .mount();

  it("doesn't add the isRendered class initially", () => {
    expect(wrapper.find(".isRendered")).toHaveLength(0);
  });

  it("loads the image", () => {
    wrapper.find("Image.ReleaseListing--image").simulate("load");
  });

  it("adds the isRendered class", () => {
    expect(wrapper.find(".isRendered")).toHaveLength(1);
  });

  it("calls the onLoad prop", () => {
    expect(props.onLoad).toHaveBeenCalledTimes(1);
  });

  it("sets the onLoad prop to be undefined", () => {
    wrapper.setProps({ onLoad: undefined });
  });

  it("loads the image", () => {
    wrapper.find("Image.ReleaseListing--image").simulate("load");
  });

  it("matches snapshot", () => {
    expect(wrapper.render()).toMatchSnapshot();
  });
});
