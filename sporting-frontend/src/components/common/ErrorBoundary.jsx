import React, { Component } from 'react';
import { RefreshCw, AlertTriangle, Home } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log to console in development
    console.error('Error caught by boundary:', error);
    console.error('Error info:', errorInfo);

    // Update state with error details
    this.setState(prevState => ({
      error,
      errorInfo,
      errorCount: prevState.errorCount + 1
    }));

    // Optional: Send error to logging service
    this.logErrorToService(error, errorInfo);
  }

  logErrorToService = (error, errorInfo) => {
    // Placeholder for error logging service (Sentry, LogRocket, etc.)
    const errorData = {
      message: error.toString(),
      stack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // In production, send to logging service
    if (process.env.NODE_ENV === 'production') {
      // fetch('/api/logs', { method: 'POST', body: JSON.stringify(errorData) });
      console.log('Error logged:', errorData);
    }
  };

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  handleReload = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="d-flex align-items-center justify-content-center"
          style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}
        >
          <div
            className="card shadow-lg p-5 text-center border-0"
            style={{ maxWidth: '500px', borderRadius: '15px' }}
          >
            <div className="mb-4">
              <AlertTriangle size={80} className="text-danger" />
            </div>

            <h1 className="fw-bold text-dark mb-3">Oops! Something went wrong</h1>

            <p className="text-muted mb-4">
              We're sorry for the inconvenience. An unexpected error has occurred.
              {this.state.errorCount > 2 && ' This error has occurred multiple times.'}
            </p>

            {process.env.NODE_ENV === 'development' && (
              <div
                className="alert alert-warning text-start mb-4 small"
                style={{ maxHeight: '200px', overflow: 'auto', backgroundColor: '#fff8e1' }}
              >
                <strong>Error Details (Development Only):</strong>
                <p className="mb-2">{this.state.error?.toString()}</p>
                <details className="mt-2">
                  <summary className="cursor-pointer fw-bold">Stack Trace</summary>
                  <pre className="mt-2 small" style={{ overflowX: 'auto' }}>
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              </div>
            )}

            <div className="d-flex gap-2 justify-content-center">
              <button
                onClick={this.handleReset}
                className="btn btn-primary d-flex align-items-center gap-2"
              >
                <RefreshCw size={18} />
                Try Again
              </button>
              <button
                onClick={this.handleReload}
                className="btn btn-outline-secondary d-flex align-items-center gap-2"
              >
                <Home size={18} />
                Back Home
              </button>
            </div>

            <hr className="my-4" />

            <small className="text-muted">
              Error ID: {this.state.errorCount > 0 ? `ERR-${Date.now()}` : 'N/A'}
            </small>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
