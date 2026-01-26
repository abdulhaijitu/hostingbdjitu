import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  /** Optional fallback component */
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * AdminErrorBoundary - Catches ONLY runtime crashes
 * 
 * This boundary should NOT catch:
 * - authLoading states
 * - roleLoading states
 * - missing data states
 * - empty states
 * 
 * It ONLY catches:
 * - JavaScript runtime errors
 * - Unhandled promise rejections in render
 * - Component lifecycle crashes
 */
class AdminErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render shows the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error for debugging (could be sent to error tracking service)
    console.error('[AdminErrorBoundary] Runtime error caught:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });
    
    this.setState({ errorInfo });
  }

  handleRetry = (): void => {
    // Reset error state and try to re-render
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReload = (): void => {
    // Full page reload
    window.location.reload();
  };

  handleGoBack = (): void => {
    // Go back to previous page
    window.history.back();
  };

  handleGoHome = (): void => {
    // Navigate to admin dashboard
    window.location.href = '/admin';
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="flex-1 flex items-center justify-center min-h-[400px] p-4">
          <div className="text-center max-w-lg">
            {/* Error Icon */}
            <div className="h-20 w-20 rounded-2xl bg-destructive/10 mx-auto mb-6 flex items-center justify-center">
              <AlertTriangle className="h-10 w-10 text-destructive" />
            </div>

            {/* Error Title */}
            <h2 className="text-2xl font-bold mb-3 text-foreground">
              কিছু একটা সমস্যা হয়েছে
            </h2>

            {/* Error Description */}
            <p className="text-muted-foreground mb-6">
              এই পেজে একটি অপ্রত্যাশিত সমস্যা দেখা দিয়েছে। আপনি আবার চেষ্টা করতে পারেন অথবা অ্যাডমিন ড্যাশবোর্ডে ফিরে যেতে পারেন।
            </p>

            {/* Error Details (collapsible in production) */}
            {this.state.error && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors">
                  টেকনিক্যাল ডিটেইলস দেখুন
                </summary>
                <div className="mt-3 p-4 bg-muted/50 rounded-lg border border-border overflow-auto max-h-48">
                  <p className="text-sm font-mono text-destructive mb-2">
                    {this.state.error.message}
                  </p>
                  {this.state.error.stack && (
                    <pre className="text-xs text-muted-foreground whitespace-pre-wrap break-words">
                      {this.state.error.stack.split('\n').slice(0, 5).join('\n')}
                    </pre>
                  )}
                </div>
              </details>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={this.handleRetry} 
                variant="default"
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                আবার চেষ্টা করুন
              </Button>
              
              <Button 
                onClick={this.handleReload} 
                variant="secondary"
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                পেজ রিলোড করুন
              </Button>

              <Button 
                onClick={this.handleGoHome} 
                variant="outline"
                className="gap-2"
              >
                <Home className="h-4 w-4" />
                ড্যাশবোর্ড
              </Button>
            </div>

            {/* Go Back Link */}
            <button
              onClick={this.handleGoBack}
              className="mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
            >
              <ArrowLeft className="h-3 w-3" />
              পেছনে যান
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AdminErrorBoundary;
