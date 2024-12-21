import app from "lightserverjs";

// Global middleware example
app.use((req, res, next) => {
  console.log(`Global middleware: ${req.method} request to ${req.url}`);
  next();
});

// Route-specific middleware example
const authMiddleware = (req, res, next) => {
  console.log("Route-specific middleware: Authentication check");

  // Add your authentication logic here
  const isAuthenticated = false; // Example: Replace with actual auth logic

  if (!isAuthenticated) {
    res.writeHead(401, { "Content-Type": "text/plain" });
    res.end("Unauthorized");
    return; // Terminate the request here
  }

  next(); // Proceed to the next middleware or route handler
};

// Routes
app.get("/", (req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Welcome to LightServerJs!");
});


app.addRoute("get", "/about", (req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("This is a protected route.");
});

app.get(
  "/protected",
  (req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("This is a protected route.");
  },
  [authMiddleware]
);

app.get(
  "/users/:id",
  (req, res) => {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ userId: req.params.id }));
  },
  [authMiddleware]
);

app.get("/search", (req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ query: req.query }));
});

const port = 3000;
app.listen(port, () => {
  console.log(`LightServerJs running at http://localhost:${port}`);
});
