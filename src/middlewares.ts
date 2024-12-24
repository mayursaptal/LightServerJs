import { IncomingMessage, ServerResponse } from "http";

// Function to execute an array of middlewares in sequence
const executeMiddlewares = (
  middlewares: Function[],        // Array of middlewares to execute
  req: IncomingMessage,           // Incoming HTTP request
  res: ServerResponse,            // HTTP response
  next: (err?: Error) => void     // Final next function to be called, accepts an optional error
) => {
  let index = 0;  // Index to keep track of which middleware is being executed

  // Function to call the next middleware or handle errors
  const nextMiddleware = (err?: Error) => {
    if (err) {
      return next(err); // If an error is passed, immediately call the final next with error
    }

    // If there are more middlewares to execute, run the next one
    if (index < middlewares.length) {
      middlewares[index++](req, res, nextMiddleware); // Execute current middleware and move to next
    } else {
      next(); // If all middlewares are executed, call the final next function
    }
  };

  nextMiddleware(); // Start executing the middlewares by calling the first one
};

export { executeMiddlewares };
