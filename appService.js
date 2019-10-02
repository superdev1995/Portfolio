const { assets, buildId, staticFiles } = serviceWorkerOption;

const CACHE_PREFIX = "mynameisviii.com";
const cacheNames = {
  api: `${CACHE_PREFIX}-api`,
  cdn: `${CACHE_PREFIX}-cdn`,
  googleApis: `${CACHE_PREFIX}-googleApis`,
  local: `${CACHE_PREFIX}-local-${buildId}`,
  precache: `${CACHE_PREFIX}-precache-${buildId}`
};

const precacheUrls = [].concat(assets, staticFiles);

const isCacheValid = key => {
  for (const name in cacheNames) {
    if (cacheNames[name] === key) {
      return true;
    }
  }

  return false;
};

importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/3.4.1/workbox-sw.js"
);

workbox.core.setCacheNameDetails({
  prefix: CACHE_PREFIX,
  suffix: buildId
});

workbox.skipWaiting();
workbox.clientsClaim();

if (buildId !== "development") {
  workbox.precaching.precacheAndRoute(
    precacheUrls.map(item => ({
      revision: buildId,
      url: item
    })),
    {
      cleanUrls: false
    }
  );

  // Local cache-first requests
  workbox.routing.registerRoute(
    request =>
      request.url.host === self.location.host &&
      !precacheUrls.includes(request.url.pathname),
    workbox.strategies.cacheFirst({
      cacheName: cacheNames.local,
      plugins: [
        new workbox.cacheableResponse.Plugin({
          statuses: [0, 200]
        }),
        new workbox.expiration.Plugin({
          maxAgeSeconds: 2 * 60 * 60
        })
      ]
    })
  );
}

workbox.googleAnalytics.initialize({
  cacheName: cacheNames.googleApis
});

// Static content requests from Google APIs
workbox.routing.registerRoute(
  new RegExp("https://(?:fonts).(?:googleapis|gstatic).com/(.*)"),
  workbox.strategies.cacheFirst({
    cacheName: cacheNames.googleApis,
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      })
    ]
  })
);

// Dynamic content requests from Google APIs
workbox.routing.registerRoute(
  new RegExp("https://(?:maps).(?:googleapis|gstatic).com/(.*)"),
  workbox.strategies.networkOnly({
    cacheName: cacheNames.googleApis,
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      })
    ]
  })
);

// App CDN requests
workbox.routing.registerRoute(
  new RegExp("https://s3.amazonaws.com/mynameisviii-static/(.*)"),
  workbox.strategies.cacheFirst({
    cacheName: cacheNames.cdn,
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      })
    ]
  })
);

// App API requests
// Listings - cache for 2 hours
workbox.routing.registerRoute(
  new RegExp("https://api.mynameisviii.com/(.*)/find(.*)"),
  workbox.strategies.cacheFirst({
    cacheName: cacheNames.api,
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      }),
      new workbox.expiration.Plugin({
        maxAgeSeconds: 2 * 60 * 60
      })
    ]
  })
);
// Entities - cache for a week
workbox.routing.registerRoute(
  new RegExp("https://api.mynameisviii.com/(.*)/[^find](.*)"),
  workbox.strategies.cacheFirst({
    cacheName: cacheNames.api,
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      }),
      new workbox.expiration.Plugin({
        maxAgeSeconds: 7 * 24 * 60 * 60
      })
    ]
  })
);

self.addEventListener("activate", event => {
  // Cleanup redundant caches
  event.waitUntil(
    caches.keys().then(keys => {
      let hasDeletedCaches = false;
      keys.forEach(key => {
        if (!isCacheValid(key)) {
          caches.delete(key);
          indexedDB.deleteDatabase(key);
          hasDeletedCaches = true;
        }
      });

      // Notify client that a new version is available, when an old version exists
      if (hasDeletedCaches) {
        self.clients.matchAll().then(clients => {
          clients.forEach(client => {
            client.postMessage({
              type: "serviceWorker.activate"
            });
          });
        });
      }
    })
  );
});

// Handle postMessage requests from the application
self.onmessage = message => {
  if (message.data.type === "changeRoute") {
    return caches
      .open(cacheNames.local)
      .then(cache => cache.add(message.data.payload));
  }
};
