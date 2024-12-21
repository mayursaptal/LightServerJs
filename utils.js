export const matchRoute = (path, routePath) => {
    const paramNames = [];
    const regexPath = routePath
      .replace(/:([^\/]+)/g, (_, paramName) => {
        paramNames.push(paramName);
        return "([^/]+)";
      })
      .replace(/\//g, "\\/");
  
    const regex = new RegExp(`^${regexPath}$`);
    const match = path.match(regex);
  
    if (!match) return null;
  
    const params = paramNames.reduce((acc, name, index) => {
      acc[name] = match[index + 1];
      return acc;
    }, {});
  
    return params;
  };
  