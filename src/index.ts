import http, { IncomingMessage as HttpIncomingMessage, ServerResponse } from "http";
import { executeMiddlewares } from "./middlewares";  // Function to execute middlewares in sequence
import { addRoute, getRoute } from "./routes";      // Functions to manage route handling
import { matchRoute } from "./utils";               // Function to match dynamic route parameters
import url from "url";

// Extending the IncomingMessage interface to include query and params
interface IncomingMessage extends HttpIncomingMessage {
  query?: Record<string, string | string[]>;
  params?: Record<string, string>;
}

// Middleware function type definition
type Middleware = (
  req: IncomingMessage,
  res: ServerResponse,
  next: (err?: Error) => void // next function allows error handling
) => void;

// Route interface definition for HTTP methods, paths, and middleware
interface Route {
  method: string;
  path: string;
  handler: Middleware;
  middlewares: Middleware[];
}

// App interface defines the overall structure and methods for the application
interface App {
  globalMiddlewares: Middleware[];          // Array to hold global middlewares
  globalHeaders: Record<string, string>;    // Object to hold global headers
  use(middleware: Middleware): void;         // Method to add middleware to the app
  route(
    method: string,
    path: string,
    handler: Middleware,
    middlewares?: Middleware[]           // Optional additional middlewares for specific routes
  ): void;
  listen(port: number, callback?: () => void): void;  // Start the server and listen on a port
  handler(req: IncomingMessage, res: ServerResponse): void;  // Handle incoming requests
  addRoute: typeof addRoute;                         // Reference to the addRoute function for adding routes
  handleError(err: Error, res: ServerResponse): void;  // Error handler for server issues
  notFound(res: ServerResponse): void;               // Handles 404 Not Found errors
  setHeaders(headers: Record<string, string>): void;   // Sets global headers
}

// The app object implements the App interface
const app: App = {
  globalMiddlewares: [], // Initialize an empty array for global middlewares
  globalHeaders: {},     // Initialize an empty object for global headers

  // Method to add global middlewares
  use(middleware) {
    this.globalMiddlewares.push(middleware);
  },

  // Method to add routes to the app
  route(method, path, handler, middlewares: Middleware[] = []) {
    addRoute(method.toLowerCase(), path, handler, middlewares);
  },

  // Start the server and listen on a specific port
  listen(port, callback) {
    http.createServer(this.handler.bind(this)).listen(port, callback);
  },

  // Main request handler to execute middlewares and route the request
  handler(req, res) {
    const parsedUrl = url.parse(req.url ?? "", true); // Parse the URL with query parameters
    req.query = parsedUrl.query as Record<string, string | string[]>; // Attach query parameters to the request
    const pathname = parsedUrl.pathname ?? "";  // Extract the pathname from the URL
    const method = req.method?.toLowerCase() ?? ""; // Get the HTTP method (e.g., GET, POST)

    // Execute global middlewares
    executeMiddlewares(this.globalMiddlewares, req, res, (err) => {
      if (err) {
        this.handleError(err, res); // Handle errors
        return;
      }

      // Match the route for the request
      const route = getRoute(method, pathname);
      if (route) {
        req.params = matchRoute(pathname, route.path) || {}; // Extract route parameters
        // Execute middlewares for the matched route
        executeMiddlewares(route.middlewares, req, res, (err) => {
          if (err) {
            this.handleError(err, res); // Handle errors
            return;
          }
          // Execute the route handler
          route.handler(req, res, (err?: Error) => {
            if (err) {
              this.handleError(err, res); // Handle errors
            }
          });
        });
      } else {
        this.notFound(res); // Handle 404 if no route matches
      }
    });
  },

  // Add a route to the app
  addRoute,

  // Error handling function for internal errors
  handleError(err: Error, res: ServerResponse) {
    console.error(err);  // Log the error to the console
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Internal Server Error" }));
  },

  // 404 Not Found handler
  notFound(res: ServerResponse) {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Route Not Found" }));
  },

  // Method to set global headers for all responses
  setHeaders(headers: Record<string, string>) {
    this.globalHeaders = { ...this.globalHeaders, ...headers }; // Merge with existing headers
  },
};

// Middleware to set headers dynamically for each response
const setHeadersMiddleware: Middleware = (req, res, next) => {
  // Loop through global headers and set them on the response
  for (const [key, value] of Object.entries(app.globalHeaders)) {
    res.setHeader(key, value);
  }
  next(); // Proceed to the next middleware or route handler
};

// Add the dynamic headers middleware globally to the app
app.use(setHeadersMiddleware);

// Dynamically create HTTP method handlers (e.g., app.get, app.post, etc.)
["get", "post", "put", "delete", "patch"].forEach((method) => {
  (app as any)[method] = function (
    path: string,
    handler: Middleware,
    middlewares: Middleware[] = []
  ) {
    this.route(method, path, handler, middlewares); // Add the method-specific route
  };
});

// Export the app for use in other modules
export default app;
