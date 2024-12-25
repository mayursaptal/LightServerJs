
// Hardcoded authentication check
export const authMiddleware = (req, res, next) => {
  console.log("Route-specific middleware: Authentication check");

  // Add your authentication logic here
  const isAuthenticated = true; // Example: Replace with actual auth logic

  if (!isAuthenticated) {
    res.writeHead(401, { "Content-Type": "text/plain" });
    res.end("Unauthorized");
    return; // Terminate the request here
  }

  next(); // Proceed to the next middleware or route handler
};

// Middleware to set dynamic headers for each response
export const setHeadersMiddleware = (req, res, next) => {
  // Add or modify headers dynamically for each response
  res.setHeader("X-Request-Time", new Date().toISOString());
  next();
};
