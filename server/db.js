/* eslint-disable global-require */
const appearances = require("./mocks/appearances");
const galleries = require("./mocks/galleries");
const gallery = require("./mocks/gallery");
const news = require("./mocks/news");
const releases = require("./mocks/releases");
const resources = require("./mocks/resources");
const stems = require("./mocks/stems");

module.exports = {
  appearances,
  appearance: appearances.Items[0] || {},
  galleries,
  gallery,
  news,
  newsArticle: news.Items[0] || {},
  releases,
  release: releases.Items[0] || {},
  resources,
  stems
};
