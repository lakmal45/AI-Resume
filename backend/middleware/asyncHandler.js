/**
 * Wraps an async Express route handler so that any thrown/rejected error
 * is automatically forwarded to the global error handler via next(err).
 *
 * Without this, unhandled promise rejections crash the server.
 *
 * Usage:  router.get("/", auth, asyncHandler(async (req, res) => { ... }));
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
