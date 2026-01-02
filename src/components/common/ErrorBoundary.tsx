import React from "react";

type ErrorBoundaryProps = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error) => void;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error?: Error;
};

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    this.props.onError?.(error);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="min-h-[60vh] flex items-center justify-center p-6">
            <div className="max-w-md w-full rounded-xl border border-border bg-card p-6 text-center">
              <h2 className="text-lg font-semibold text-foreground">Something went wrong</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                The app encountered an unexpected error. Try reloading the dashboard.
              </p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-5 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
              >
                Reload
              </button>
            </div>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
