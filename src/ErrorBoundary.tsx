import React from "react";
import { toast } from "@/components/ui/use-toast";
import { logError } from "./services/logging";
import { ErrorDisplay } from "./components/ErrorDisplay";
import { getI18n } from "react-i18next";
import "./i18n/config";

type ErrorBoundaryProps = {
  children: React.ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  t;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
    this.t = getI18n().t;
  }

  static getDerivedStateFromError(error: Error) {
    // Update state to display the fallback UI and capture the error.
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error to an external reporting service.
    logError("Uncaught error:", error, errorInfo);

    // Show a toast notification with the localized error message.
    toast({
      text: this.t("errorBoundary_error_unexpected"),
      variant: "destructive",
      duration: 5000,
    });
  }

  render() {
    if (this.state.hasError) {
      return <ErrorDisplay type="500" />;
    }

    return this.props.children;
  }
}
