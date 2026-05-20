import React, { Component } from 'react';
import PixelDesert from './ui/PixelDesert';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center bg-white px-4 py-12">
          <PixelDesert message="SOMETHING WENT WRONG" />
          <div className="flex flex-wrap gap-3 justify-center mt-8">
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="btn-secondary"
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
