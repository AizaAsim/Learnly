/**
 * This file contains the logging functions for the application.
 * It's just a wrapper on the Firebase Functions logger, but
 * it's useful to have a single place to change the logging
 */

import { log, error, info, warn, debug } from "firebase-functions/logger";

export function logMessage(...args: unknown[]) {
  log(...args);
}
export function logError(...args: unknown[]) {
  error(...args);
}

export function logInfo(...args: unknown[]) {
  info(...args);
}

export function logWarning(...args: unknown[]) {
  warn(...args);
}

export function logDebug(...args: unknown[]) {
  debug(...args);
}
