import * as Sentry from "@sentry/react";

type LogArgs = (string | Error | unknown)[];

export const logMessage = (...args: LogArgs) => {
  Sentry.captureMessage(args.join(", "));
};

export const logError = (...args: LogArgs) => {
  const errors = args.filter((arg) => arg instanceof Error) as Error[];
  errors.forEach((error) => {
    Sentry.captureException(error);
  });
  if (errors.length !== args.length) {
    const messages = args.filter((arg) => !(arg instanceof Error));
    Sentry.captureMessage(messages.join(", "), "error");
  }
};

export const logWarning = (...args: LogArgs) => {
  Sentry.captureMessage(args.join(", "), "warning");
};

export const logInfo = (...args: LogArgs) => {
  Sentry.captureMessage(args.join(", "), "info");
};

export const logDebug = (...args: LogArgs) => {
  Sentry.captureMessage(args.join(", "), "debug");
};

export const logFatal = (...args: LogArgs) => {
  Sentry.captureMessage(args.join(", "), "fatal");
};
