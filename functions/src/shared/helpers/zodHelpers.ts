import { ZodError } from "zod";

/**
 * Returns a formatted error message from a ZodError instance.
 * @param error Zod Error instance
 * @returns string Error message. Concatenates all errors in the ZodError instance.
 */
export function formatZodError(error: ZodError): string {
  return error.errors
    .map((errorDetail) => {
      const { path, message } = errorDetail;
      const field = path.join(".");
      return `Invalid value for ${field}: ${message}`;
    })
    .join(", ");
}
