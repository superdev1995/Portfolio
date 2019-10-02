const routes = require("next-routes")();

routes.add("/appearances/:slug", "appearances/appearance");
routes.add("/galleries/:slug", "galleries/gallery");
routes.add("/news/:slug", "news/article");
routes.add("/releases/:slug", "releases/release");

module.exports = routes;
