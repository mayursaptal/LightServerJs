const executeMiddlewares = (middlewares, req, res, next) => {
  let index = 0;
  const nextMiddleware = () => {
    if (index < middlewares.length) {
      middlewares[index++](req, res, nextMiddleware);
    } else {
      next();
    }
  };
  nextMiddleware();
};

export { executeMiddlewares };
