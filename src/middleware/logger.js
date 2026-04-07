// Middleware is a function that runs BEFORE your route handler
// It has access to req (request), res (response), and next (continue to next middleware)

function logger(req, res, next) {
  const start = Date.now();

  // This runs AFTER the response is sent
  res.on("finish", () => {
    const duration = Date.now() - start;
    const statusColor =
      res.statusCode >= 500
        ? "\x1b[31m" // Red for 5xx
        : res.statusCode >= 400
        ? "\x1b[33m" // Yellow for 4xx
        : "\x1b[32m"; // Green for 2xx/3xx

    console.log(
      `${statusColor}${req.method}\x1b[0m ${req.url} → ${res.statusCode} (${duration}ms)`
    );
  });

  // MUST call next() to pass control to the next middleware/route
  // If you forget next(), the request hangs forever!
  next();
}

module.exports = logger;