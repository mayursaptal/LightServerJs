import app from "./app.js";

// Global middleware example
app.use((req, res, next) => {
  console.log(`Global middleware: ${req.method} request to ${req.url}`);
  next();
});

// Route-specific middleware example
const authMiddleware = (req, res, next) => {
  console.log("Route-specific middleware: Authentication check");
  // Add authentication logic here
  next();
};

// Routes
app.get("/", (req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Welcome to LightServerJs!");
});

app.get("/protected", (req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("This is a protected route.");
}, [authMiddleware]);

app.get("/users/:id", (req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ userId: req.params.id }));
}, [authMiddleware]);

app.get("/search", (req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ query: req.query }));
});

export default app;
