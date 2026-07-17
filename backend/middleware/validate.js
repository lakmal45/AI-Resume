import { ZodError } from "zod";

/**
 * Express middleware factory that validates req.body against a Zod schema.
 * Returns 400 with structured error messages on failure.
 *
 * Usage:  router.post("/register", validate(registerSchema), handler);
 */
export function validate(schema) {
  return (req, res, next) => {
    try {
      // Parse and replace req.body with the cleaned/validated data
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError || err.name === "ZodError") {
        const issues = err.issues || err.errors || [];
        const errors = issues.map((e) => ({
          field: e.path ? e.path.join(".") : "",
          message: e.message,
        }));

        return res.status(400).json({
          message: "Validation failed",
          errors,
        });
      }

      next(err);
    }
  };
}
