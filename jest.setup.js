import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import createGoogleMapsMock from "jest-google-maps-mock";
import MockDate from "mockdate";

Enzyme.configure({ adapter: new Adapter() });

MockDate.set("2018-01-01T00:00:00", 0);

Object.defineProperties(window, {
  dataLayer: {
    value: [],
    writable: true
  },
  google: {
    value: {
      maps: createGoogleMapsMock()
    },
    writable: true
  },
  requestAnimationFrame: {
    value: callback => setTimeout(callback, 0),
    writable: true
  },
  scrollTo: {
    value: jest.fn(),
    writable: true
  }
});

Object.defineProperty(window.location, "assign", {
  value: jest.fn(),
  writable: true
});

const serviceWorkerEvents = {};
Object.defineProperty(window.navigator, "serviceWorker", {
  value: {
    addEventListener: jest.fn((event, handler) => {
      if (!serviceWorkerEvents[event]) {
        serviceWorkerEvents[event] = [];
      }
      serviceWorkerEvents[event].push(handler);
    }),
    controller: {
      postMessage: jest.fn(),
      state: "activated"
    },
    dispatchEvent: jest.fn(event => {
      if (serviceWorkerEvents[event.type]) {
        serviceWorkerEvents[event.type].forEach(handler => {
          handler(event);
        });
      }
    }),
    register: jest.fn(),
    removeEventListener: jest.fn((event, handler) => {
      if (serviceWorkerEvents[event]) {
        serviceWorkerEvents[event].forEach((boundHandler, index) => {
          if (handler === boundHandler) {
            serviceWorkerEvents[event].splice(index, 1);
          }
        });
      }
    })
  },
  writable: true
});
