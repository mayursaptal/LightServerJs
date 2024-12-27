import { IncomingMessage as HttpIncomingMessage, ServerResponse } from "http";

// Extending the IncomingMessage interface
export interface IncomingMessage extends HttpIncomingMessage {
  query?: Record<string, string | string[]>;
  params?: Record<string, string>;
}

// Middleware function type definition
export type Middleware = (
  req: IncomingMessage,
  res: ServerResponse,
  next: (err?: Error) => void
) => void;

// Route interface definition
export interface Route {
  method: string;
  path: string;
  handler: Middleware;
  middlewares: Middleware[];
}

// App interface definition
export interface App {
  globalMiddlewares: Middleware[];
  globalHeaders: Record<string, string>;

  use(middleware: Middleware): void;

  route(
    method: string,
    path: string,
    handler: Middleware,
    middlewares?: Middleware[]
  ): void;

  listen(port: number, callback?: () => void): void;

  handler(req: IncomingMessage, res: ServerResponse): void;

  addRoute(
    method: string,
    path: string,
    handler: Middleware,
    middlewares?: Middleware[]
  ): void;

  handleError(err: Error, res: ServerResponse): void;

  notFound(res: ServerResponse): void;

  setHeaders(headers: Record<string, string>): void;

  get(
    path: string,
    handler: Middleware,
    middlewares?: Middleware[]
  ): void;

  post(
    path: string,
    handler: Middleware,
    middlewares?: Middleware[]
  ): void;

  put(
    path: string,
    handler: Middleware,
    middlewares?: Middleware[]
  ): void;

  delete(
    path: string,
    handler: Middleware,
    middlewares?: Middleware[]
  ): void;

  patch(
    path: string,
    handler: Middleware,
    middlewares?: Middleware[]
  ): void;
}

// Export the app instance
declare const app: App;

export default app;
