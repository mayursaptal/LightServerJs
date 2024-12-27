import app from "lightserverjs";
import { setHeadersMiddleware } from "./middlewares/authMiddleware.js";
import userRoutes from "./routes/userRoutes.js";

// Set global headers
app.setHeaders({
  "X-Powered-By": "LightServerJs",
  "Content-Type": "application/json",
});

// Use global middleware for logging requests
app.use((req, res, next) => {
  console.log(`Global middleware: ${req.method} request to ${req.url}`);
  next();
});


app.get('/',(req, res, next) => {
  res.writeHead(200);
  res.end('Hello World');
});



// Use route-specific middleware for authentication on routes
app.use(setHeadersMiddleware);

// Register user routes

[...userRoutes].forEach((route) => {
  app.route(route.method, route.path, route.handler, route.middlewares);
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`LightServerJs running at http://localhost:${port}`);
});
