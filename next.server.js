/* eslint-disable no-console, global-require, import/no-dynamic-require */

const path = require("path");
const glob = require("glob");
const accepts = require("accepts");
const express = require("express");
const nextJS = require("next");
const compression = require("compression");
const jsonServer = require("json-server");

const customRoutes = require("./next.routes");

const dev = process.env.NODE_ENV !== "production";
const port = process.env.PORT || 5000;
const apiURL = process.env.API_URL || "/mock-api";
const app = nextJS({ dev });
const customRoutesHandler = customRoutes.getRequestHandler(app);

const languages = glob
  .sync("./src/locales/*.ts")
  .map(f => path.basename(f, ".ts"));

app.prepare().then(() => {
  const server = express();

  if (dev) {
    if (process.env.API_DELAY) {
      server.use(apiURL, (req, res, next) => {
        setTimeout(() => {
          next();
        }, process.env.API_DELAY);
      });
    }

    server.use(apiURL, jsonServer.rewriter(require("./server/routes")));
    server.use(apiURL, jsonServer.router(require("./server/db")));
  } else {
    server.use(compression());
  }

  server.use(
    "/assets",
    express.static(path.join(__dirname, "dist/server/assets"))
  );

  server.use(
    "/appService.js",
    express.static(path.join(__dirname, "dist/appService.js"), {
      setHeaders: res => {
        res.set("Cache-Control", "max-age=0");
      }
    })
  );

  server.use((req, res) => {
    const accept = accepts(req);
    const locale = accept.language(languages);

    if (typeof locale === "string") {
      req.locale = locale;
    } else if (
      Array.isArray(locale) &&
      locale.filter(item => item !== "*").length > 0
    ) {
      req.locale = locale.filter(item => item !== "*")[0];
    } else {
      req.locale = "en-NZ";
    }

    customRoutesHandler(req, res);
  });

  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
