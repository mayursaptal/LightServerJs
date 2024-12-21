import { executeMiddlewares } from "./middlewares.js";
import { addRoute, getRoute } from "./routes.js";
import { matchRoute } from "./utils.js"; // Import matchRoute
import http from "http";
import url from "url";

const app = {
  use(middleware) {
    this.globalMiddlewares.push(middleware);
  },
  globalMiddlewares: [],
  // Route methods now use `addRoute` directly
  get(path, handler, middlewares = []) {
    addRoute("get", path, handler, middlewares);
  },
  post(path, handler, middlewares = []) {
    addRoute("post", path, handler, middlewares);
  },
  put(path, handler, middlewares = []) {
    addRoute("put", path, handler, middlewares);
  },
  delete(path, handler, middlewares = []) {
    addRoute("delete", path, handler, middlewares);
  },
  patch(path, handler, middlewares = []) {
    addRoute("patch", path, handler, middlewares);
  },
  addRoute,
  handler(req, res) {
    const parsedUrl = url.parse(req.url, true);
    req.query = parsedUrl.query; // Attach query params
    const { pathname } = parsedUrl;
    const method = req.method.toLowerCase();

    // Execute global middlewares
    executeMiddlewares(this.globalMiddlewares, req, res, () => {
      const route = getRoute(method, pathname);
      if (route) {
        req.params = matchRoute(pathname, route.path) || {};
        // Execute route-specific middlewares
        executeMiddlewares(route.middlewares, req, res, () => {
          route.handler(req, res);
        });
      } else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("404 Not Found");
      }
    });
  },

  listen(port, callback) {
    http.createServer(this.handler.bind(this)).listen(port, callback);
  },
};

export default app;
