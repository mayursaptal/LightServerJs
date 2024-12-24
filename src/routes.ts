import { matchRoute } from "./utils";

// `routes` object stores routes categorized by HTTP methods (GET, POST, etc.)
// Each method has an array of route objects, where each route contains a path, a handler, and middlewares.
const routes: Record<
  string,  // Key is the HTTP method (GET, POST, etc.)
  Array<{ path: string; handler: Function; middlewares: Function[] }>  // Each method has an array of route objects
> = {
  get: [],      // Stores GET request routes
  post: [],     // Stores POST request routes
  put: [],      // Stores PUT request routes
  delete: [],   // Stores DELETE request routes
  patch: [],    // Stores PATCH request routes
  options: [],  // Stores OPTIONS request routes
};

// `addRoute` function adds a new route to the `routes` object for the specified HTTP method
// It accepts the method, path, handler, and optional middlewares.
const addRoute = (
  method: string,                    // HTTP method (e.g., GET, POST)
  path: string,                      // The route path (e.g., /users)
  handler: Function,                 // The handler function for the route
  middlewares: Function[] = []       // Optional middlewares to be applied to the route
) => {
  routes[method].push({ path, handler, middlewares }); // Add the new route to the corresponding HTTP method array
};

// `getRoute` function retrieves the route for the given HTTP method and path
// It uses `matchRoute` to check if the path matches any of the registered routes.
const getRoute = (method: string, pathname: string) => {
  // Find a route where the method matches and the path is successfully matched
  const route = routes[method].find(({ path }) => matchRoute(pathname, path));
  return route; // Return the matched route (or undefined if no match)
};

export { routes, addRoute, getRoute };  // Export the routes object, and helper functions for adding and getting routes
