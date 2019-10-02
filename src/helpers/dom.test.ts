import { createMockElement } from "../utilities/mocks";
import * as dom from "./dom";

const screenWidth = 1920;
const screenHeight = 1080;
const html = document.documentElement as HTMLHtmlElement;
const { body } = document;

const setScreenSize = (width: number, height: number, isInner = true) => {
  Object.defineProperties(window, {
    innerHeight: { value: isInner ? height : undefined, writable: true },
    innerWidth: { value: isInner ? width : undefined, writable: true }
  });

  Object.defineProperties(document.documentElement, {
    clientHeight: { value: !isInner ? height : undefined, writable: true },
    clientWidth: { value: !isInner ? width : undefined, writable: true }
  });
};

const setIsServer = (value = true) => {
  Object.defineProperty(window, "isServer", {
    value,
    writable: true
  });
};

describe("[helpers] DOM", () => {
  describe("isInViewport", () => {
    const inside: any = {
      bottomLeft: createMockElement(200, 200, screenHeight - 200),
      bottomRight: createMockElement(
        200,
        200,
        screenHeight - 200,
        screenWidth - 200
      ),
      topLeft: createMockElement(200, 200),
      topRight: createMockElement(200, 200, 0, screenWidth - 200)
    };
    const outside: any = {
      bottomLeft: createMockElement(200, 200, screenHeight - 199),
      bottomRight: createMockElement(
        200,
        200,
        screenHeight - 199,
        screenWidth - 199
      ),
      topLeft: createMockElement(200, 200, -1, -1),
      topRight: createMockElement(200, 200, -1, screenWidth - 199)
    };

    it("returns false when an element isn't provided", () => {
      expect(dom.isInViewport()).toBe(false);
    });

    describe("on a browser that supports window.innerWidth and window.innerHeight", () => {
      beforeAll(() => {
        setScreenSize(screenWidth, screenHeight, true);
      });

      it("returns true when entire element is within the viewport", () => {
        expect(dom.isInViewport(inside.topLeft)).toBe(true);
        expect(dom.isInViewport(inside.topRight)).toBe(true);
        expect(dom.isInViewport(inside.bottomRight)).toBe(true);
        expect(dom.isInViewport(inside.bottomLeft)).toBe(true);
      });

      it("returns false when entire element is outside of the viewport", () => {
        expect(dom.isInViewport(outside.topLeft)).toBe(false);
        expect(dom.isInViewport(outside.topRight)).toBe(false);
        expect(dom.isInViewport(outside.bottomRight)).toBe(false);
        expect(dom.isInViewport(outside.bottomLeft)).toBe(false);
      });
    });

    describe("on a browser that doesn't support window.innerWidth and window.innerHeight", () => {
      beforeAll(() => {
        setScreenSize(screenWidth, screenHeight, false);
      });

      it("returns true when entire element is within the viewport", () => {
        expect(dom.isInViewport(inside.topLeft)).toBe(true);
        expect(dom.isInViewport(inside.topRight)).toBe(true);
        expect(dom.isInViewport(inside.bottomRight)).toBe(true);
        expect(dom.isInViewport(inside.bottomLeft)).toBe(true);
      });

      it("returns false when entire element is outside of the viewport", () => {
        expect(dom.isInViewport(outside.topLeft)).toBe(false);
        expect(dom.isInViewport(outside.topRight)).toBe(false);
        expect(dom.isInViewport(outside.bottomRight)).toBe(false);
        expect(dom.isInViewport(outside.bottomLeft)).toBe(false);
      });
    });
  });

  describe("isAlmostInViewport", () => {
    const inside: any = {
      bottomLeft: createMockElement(200, 200, screenHeight + 199, -399),
      bottomRight: createMockElement(
        200,
        200,
        screenHeight + 199,
        screenWidth + 199
      ),
      topLeft: createMockElement(200, 200, -399, -399),
      topRight: createMockElement(200, 200, -399, screenWidth + 199)
    };
    const outside: any = {
      bottomLeft: createMockElement(200, 200, screenHeight + 200, -400),
      bottomRight: createMockElement(
        200,
        200,
        screenHeight + 200,
        screenWidth + 200
      ),
      topLeft: createMockElement(200, 200, -400, -400),
      topRight: createMockElement(200, 200, -400, screenWidth + 200)
    };

    it("returns false when an element isn't provided", () => {
      expect(dom.isAlmostInViewport()).toBe(false);
    });

    describe("on a browser that supports window.innerWidth and window.innerHeight", () => {
      beforeAll(() => {
        setScreenSize(screenWidth, screenHeight, true);
      });

      it("returns true when element is within an area 200px bigger than the viewport", () => {
        expect(dom.isAlmostInViewport(inside.topLeft, 200)).toBe(true);
        expect(dom.isAlmostInViewport(inside.topRight, 200)).toBe(true);
        expect(dom.isAlmostInViewport(inside.bottomRight, 200)).toBe(true);
        expect(dom.isAlmostInViewport(inside.bottomLeft, 200)).toBe(true);
      });

      it("returns false when element is outside of an area 200px bigger than the viewport", () => {
        expect(dom.isAlmostInViewport(outside.topLeft, 200)).toBe(false);
        expect(dom.isAlmostInViewport(outside.topRight, 200)).toBe(false);
        expect(dom.isAlmostInViewport(outside.bottomRight, 200)).toBe(false);
        expect(dom.isAlmostInViewport(outside.bottomLeft, 200)).toBe(false);
      });
    });

    describe("on a browser that doesn't support window.innerWidth and window.innerHeight", () => {
      beforeAll(() => {
        setScreenSize(screenWidth, screenHeight, false);
      });

      it("returns true when element is within an area 200px bigger than the viewport", () => {
        expect(dom.isAlmostInViewport(inside.topLeft, 200)).toBe(true);
        expect(dom.isAlmostInViewport(inside.topRight, 200)).toBe(true);
        expect(dom.isAlmostInViewport(inside.bottomRight, 200)).toBe(true);
        expect(dom.isAlmostInViewport(inside.bottomLeft, 200)).toBe(true);
      });

      it("returns false when element is outside of an area 200px bigger than the viewport", () => {
        expect(dom.isAlmostInViewport(outside.topLeft, 200)).toBe(false);
        expect(dom.isAlmostInViewport(outside.topRight, 200)).toBe(false);
        expect(dom.isAlmostInViewport(outside.bottomRight, 200)).toBe(false);
        expect(dom.isAlmostInViewport(outside.bottomLeft, 200)).toBe(false);
      });
    });
  });

  describe("lockScroll", () => {
    beforeEach(() => {
      setIsServer(false);

      dom.scrollState.count = 0;
      body.scrollTop = 200;
      body.style.paddingRight = "";
      html.className = "";
    });

    it("adds `isLocked` class to html node and sets body padding to compensate for scrollbar", () => {
      dom.lockScroll();

      expect(html.classList.contains("isLocked")).toBe(true);
      expect(body.style.paddingRight).not.toBe("");
      expect(dom.scrollState.count).toBe(1);
      expect(dom.scrollState.top).toBe(200);
    });

    it("does nothing when scrolling is already locked", () => {
      dom.lockScroll();
      dom.lockScroll();

      expect(html.classList.contains("isLocked")).toBe(true);
      expect(body.style.paddingRight).toBe("0px");
      expect(dom.scrollState.count).toBe(2);
      expect(dom.scrollState.top).toBe(200);
    });

    it("takes existing body padding into consideration when compensating for scrollbar", () => {
      body.style.paddingRight = "50px";

      dom.lockScroll();

      expect(body.style.paddingRight).toBe("50px");
    });

    it("refers to html node instead of body node when body isn't what's scrolling", () => {
      body.scrollTop = 0;
      html.scrollTop = 300;

      dom.lockScroll();

      expect(body.style.paddingRight).toBe("50px");
      expect(dom.scrollState.top).toBe(300);
    });

    it("doesn't throw an error when called on the server", () => {
      setIsServer(true);

      expect(dom.lockScroll).not.toThrowError();
    });
  });

  describe("unlockScroll", () => {
    beforeEach(() => {
      setIsServer(false);

      dom.scrollState.count = 0;
      body.scrollTop = 200;
      body.style.paddingRight = "";
      html.className = "";
    });

    it("removes `isLocked` class from html node and resets body padding to initial value", () => {
      body.style.paddingRight = "50px";

      dom.lockScroll();
      expect(html.classList.contains("isLocked")).toBe(true);

      dom.unlockScroll();
      expect(html.classList.contains("isLocked")).toBe(false);
      expect(body.style.paddingRight).toBe("50px");
    });

    it("doesn't unlock scroll until it has been called the same number of times as lockScroll() has been called", () => {
      dom.lockScroll();
      dom.lockScroll();
      dom.lockScroll();

      dom.unlockScroll();
      expect(html.classList.contains("isLocked")).toBe(true);

      dom.unlockScroll();
      expect(html.classList.contains("isLocked")).toBe(true);

      dom.unlockScroll();
      expect(html.classList.contains("isLocked")).toBe(false);

      dom.unlockScroll();
      expect(html.classList.contains("isLocked")).toBe(false);
    });

    it("doesn't throw an error when called on the server", () => {
      setIsServer(true);

      expect(dom.unlockScroll).not.toThrowError();
    });
  });

  describe("isInPortal", () => {
    beforeEach(() => {
      setIsServer(false);
    });

    it("returns true when an element is within the document portal", () => {
      const element = document.createElement("div");
      const portal = document.createElement("div");
      portal.className = "Portal";
      portal.appendChild(element);
      document.body.appendChild(portal);

      expect(dom.isInPortal(element)).toBe(true);
    });

    it("returns false when an element isn't within the document portal", () => {
      const element = document.createElement("div");
      const portal = document.createElement("div");
      portal.className = "Portal";
      document.body.appendChild(portal);

      expect(dom.isInPortal(element)).toBe(false);
    });

    it("returns false when calling it on the server", () => {
      setIsServer(true);

      const element = document.createElement("div");
      expect(dom.isInPortal(element)).toBe(false);
    });
  });
});
