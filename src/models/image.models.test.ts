import { image } from "./root.models";

describe("[models] Image", () => {
  it("creates a valid object with defaults", () => {
    expect(image()).toEqual({
      imageUrl: "",
      title: ""
    });
  });

  it("creates a valid object when all properties are defined", () => {
    const data = {
      imageUrl: "URL",
      title: "Title"
    };

    expect(image(data)).toEqual({
      imageUrl: data.imageUrl,
      title: data.title
    });
  });
});
