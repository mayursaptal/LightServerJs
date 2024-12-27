// `matchRoute` is a function that checks if a given path matches a dynamic route path
// It also extracts the parameters from the dynamic segments in the route path (e.g., :id)
export const matchRoute = (path: string, routePath: string) => {

  path = path.replace(/\/+$/, ""); 

  const paramNames: string[] = []; // Array to store the names of parameters from the route path
  // Convert the routePath to a regular expression
  // - `:([^/]+)` captures dynamic segments (e.g., `:id`) and stores their names in `paramNames`
  // - `\\` escapes the forward slashes so they are treated as literal slashes
  const regexPath = routePath
    .replace(/:([^/]+)/g, (_, paramName) => {
      paramNames.push(paramName); // Store the parameter name (e.g., `id`)
      return "([^/]+)"; // Replace `:param` with a regular expression to capture any non-slash string
    })
    .replace(/\//g, "\\/"); // Escape the slashes in the route path

  // Create the final regular expression using the modified `regexPath`
  const regex = new RegExp(`^${regexPath}$`);
  // Execute the regular expression against the provided `path`
  const match = regex.exec(path);


  // If the path does not match the route, return null
  if (!match) return null;

  // If the path matches, extract the parameter values from the match result
  // `paramNames` contains the parameter names, and `match` contains the corresponding values
  const params = paramNames.reduce((acc, name, index) => {
    acc[name] = match[index + 1]; // Match group starts at index 1 (index 0 is the entire match)
    return acc;
  }, {} as Record<string, string>); // Initialize `params` as an empty object and populate it

  return params; // Return an object containing the parameter names and their values
};
