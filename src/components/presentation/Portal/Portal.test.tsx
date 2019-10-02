import * as React from "react";

import ComponentTester from "../../../utilities/ComponentTester";
import Portal from "./Portal";

const component = new ComponentTester(Portal)
  .withDefaultProps({ className: "TestPortal" })
  .withDefaultChildren(<div className="TestPortalComponent" />);

describe("[presentation] <Portal />", () => {
  describe("when mounting on the server", () => {
    Object.defineProperty(window, "isServer", {
      value: true,
      writable: true
    });

    const { wrapper } = component.mount();

    it("renders in-place", () => {
      expect(
        wrapper.find(".Portal--inPlace .TestPortalComponent")
      ).toHaveLength(1);
    });

    it("matches snapshot", () => {
      expect(wrapper.render()).toMatchSnapshot();
    });

    it("unmounts component", () => {
      wrapper.unmount();
    });
  });

  describe("when mounting on the client", () => {
    Object.defineProperty(window, "isServer", {
      value: false,
      writable: true
    });

    const { wrapper } = component.mount();

    it("creates the portal node", () => {
      expect(document.querySelectorAll(".Portal")).toHaveLength(1);
    });

    it("creates the instance container with the defined class", () => {
      expect(document.querySelectorAll(".Portal .TestPortal")).toHaveLength(1);
    });

    it("doesn't render in-place", () => {
      expect(wrapper.find(".Portal--inPlace")).toHaveLength(0);
    });

    it("renders the children", () => {
      expect(wrapper.find(".TestPortalComponent")).toHaveLength(1);
    });

    it("matches snapshot", () => {
      expect(wrapper.render()).toMatchSnapshot();
    });

    it("unmounts component", () => {
      wrapper.unmount();
    });

    it("removes the instance container from the DOM", () => {
      expect(document.querySelectorAll(".Portal *")).toHaveLength(0);
    });
  });
});
