const fs = require("fs");
const path = require("path");
const ServiceWorkerPlugin = require("serviceworker-webpack-plugin");
const withSass = require("@zeit/next-sass");
const PluginLodashModuleReplacement = require("lodash-webpack-plugin");
const FilterWarningsPlugin = require("webpack-filter-warnings-plugin");

const getPages = () => {
  return {
    "/": { page: "/" },
    "/appearances": { page: "/appearances" },
    "/galleries": { page: "/galleries" },
    "/news": { page: "/news" },
    "/releases": { page: "/releases" },
    "/resources": { page: "/resources" },
    "/stems": { page: "/stems" },
    "/symbol": { page: "/symbol" }
  };
};

const getFiles = (dir, files = []) => {
  const list = fs.readdirSync(dir);

  return list.reduce((acc, curr) => {
    const name = `${dir}/${curr}`;

    if (fs.statSync(name).isDirectory()) {
      getFiles(name, files);
    } else {
      acc.push(name.replace(__dirname, "").replace(/\\/g, "/"));
    }

    return acc;
  }, files);
};

module.exports = withSass({
  distDir: "dist",
  exportTrailingSlash: true,
  poweredByHeader: false,
  exportPathMap: async (_, { distDir, outDir }) => {
    if (outDir) {
      await util.promisify(fs.copyFile)(
        path.join(distDir, "appService.js"),
        path.join(outDir, "appService.js")
      );
    }
    return getPages();
  },
  webpack: (config, { buildId, dev }) => {
    config.output.globalObject = "this";

    config.module.rules.push(
      {
        test: /\.(svg)$/,
        use: "svg-loader"
      },
      {
        test: /\.(jpg|jpeg|png)$/,
        use: "file-loader"
      }
    );

    config.plugins.push(
      new PluginLodashModuleReplacement(),

      new FilterWarningsPlugin({
        exclude: /Conflicting order between:/
      }),

      new ServiceWorkerPlugin({
        entry: path.join(__dirname, "appService.js"),
        filename: "appService.js",
        transformOptions: swOptions => ({
          ...swOptions,
          assets: swOptions.assets
            .map(asset => `/_next${asset.replace(/\\/g, "/")}`)
            .filter(asset => asset.startsWith("/_next/static/")),
          staticFiles: [
            "/assets/main.css",
            ...getFiles(path.join(__dirname, "static"))
          ],
          buildId
        })
      })
    );

    return config;
  }
});
