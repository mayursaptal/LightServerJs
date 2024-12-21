import { matchRoute } from "./utils.js";

const routes = {
  get: [],
  post: [],
  put: [],
  delete: [],
  patch: [],
  options: [],
};

const addRoute = (method, path, handler, middlewares = []) => {
  routes[method].push({ path, handler, middlewares });
};

const getRoute = (method, pathname) => {
  const route = routes[method].find(({ path }) => matchRoute(pathname, path));
  return route;
};

export { routes, addRoute, getRoute };
