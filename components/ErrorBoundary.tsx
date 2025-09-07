'use client';

import { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { ActionLink } from './ActionLink';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: string;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: string) => void;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const errorString = errorInfo.componentStack || error.stack || 'Unknown error';
    
    this.setState({
      errorInfo: errorString,
    });

    // Call the onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorString);
    }

    // Log error for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-primary via-blue-600 to-accent flex items-center justify-center p-4">
          <div className="glass-card p-8 max-w-md w-full text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <h2 className="text-display mb-4">Something went wrong</h2>
            <p className="text-body text-white text-opacity-80 mb-6">
              We encountered an unexpected error. This has been logged and we'll look into it.
            </p>
            
            <div className="space-y-3">
              <ActionLink 
                variant="primary" 
                onClick={this.handleRetry}
                className="w-full flex items-center justify-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Try Again</span>
              </ActionLink>
              
              <ActionLink 
                variant="secondary" 
                onClick={this.handleGoHome}
                className="w-full flex items-center justify-center space-x-2"
              >
                <Home className="w-4 h-4" />
                <span>Go Home</span>
              </ActionLink>
            </div>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="text-sm text-white text-opacity-60 cursor-pointer hover:text-opacity-80">
                  Error Details (Development)
                </summary>
                <div className="mt-2 p-3 bg-black bg-opacity-30 rounded text-xs text-white text-opacity-70 font-mono overflow-auto max-h-32">
                  <div className="mb-2">
                    <strong>Error:</strong> {this.state.error.message}
                  </div>
                  {this.state.errorInfo && (
                    <div>
                      <strong>Stack:</strong>
                      <pre className="whitespace-pre-wrap">{this.state.errorInfo}</pre>
                    </div>
                  )}
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Functional component wrapper for easier usage
interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
  title?: string;
  message?: string;
}

export function ErrorFallback({ 
  error, 
  resetError, 
  title = "Something went wrong",
  message = "We encountered an unexpected error. Please try again."
}: ErrorFallbackProps) {
  return (
    <div className="glass-card p-6 text-center">
      <div className="flex justify-center mb-4">
        <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
          <AlertTriangle className="w-6 h-6 text-white" />
        </div>
      </div>
      
      <h3 className="text-heading mb-2">{title}</h3>
      <p className="text-body text-white text-opacity-80 mb-4">
        {message}
      </p>
      
      <ActionLink 
        variant="primary" 
        onClick={resetError}
        className="flex items-center justify-center space-x-2"
      >
        <RefreshCw className="w-4 h-4" />
        <span>Try Again</span>
      </ActionLink>
      
      {process.env.NODE_ENV === 'development' && (
        <details className="mt-4 text-left">
          <summary className="text-sm text-white text-opacity-60 cursor-pointer hover:text-opacity-80">
            Error Details (Development)
          </summary>
          <div className="mt-2 p-3 bg-black bg-opacity-30 rounded text-xs text-white text-opacity-70 font-mono overflow-auto max-h-32">
            {error.message}
          </div>
        </details>
      )}
    </div>
  );
}
