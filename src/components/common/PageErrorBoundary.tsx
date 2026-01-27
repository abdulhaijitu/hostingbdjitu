import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, ArrowLeft, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { logError, generateErrorId, categorizeError } from '@/lib/errorLogger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
  copied: boolean;
}

/**
 * Page-Level Error Boundary
 * Catches runtime errors in page content without affecting navigation
 * Provides user-friendly error UI with retry and navigation options
 */
class PageErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    errorId: '',
    copied: false,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { 
      hasError: true, 
      error,
      errorId: generateErrorId(),
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    
    // Log error asynchronously
    logError({
      errorCode: categorizeError(error),
      message: error.message,
      stackTrace: error.stack,
      context: {
        componentStack: errorInfo.componentStack,
        errorId: this.state.errorId,
      },
      severity: 'error',
    });
    
    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
    
    console.error('[PageErrorBoundary] Caught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: '',
      copied: false,
    });
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      this.handleGoHome();
    }
  };

  private handleCopyErrorId = async () => {
    try {
      await navigator.clipboard.writeText(this.state.errorId);
      this.setState({ copied: true });
      setTimeout(() => this.setState({ copied: false }), 2000);
    } catch {
      // Clipboard API may not be available
    }
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex items-center justify-center p-4 min-h-[400px]">
          <Card className="max-w-lg w-full shadow-lg border-destructive/20">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
              <CardTitle className="text-2xl font-bold text-destructive">
                কিছু সমস্যা হয়েছে
              </CardTitle>
              <CardDescription className="text-base mt-2">
                দুঃখিত, এই পেজে একটি ত্রুটি ঘটেছে। দয়া করে আবার চেষ্টা করুন অথবা সাপোর্টে যোগাযোগ করুন।
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Error ID for support reference */}
              <div className="p-3 bg-muted rounded-lg flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Error ID (সাপোর্টের জন্য)</p>
                  <p className="font-mono text-sm font-semibold">{this.state.errorId}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={this.handleCopyErrorId}
                  className="h-8 w-8 p-0"
                >
                  {this.state.copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {/* Error details (development only) */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="p-4 bg-muted/50 rounded-lg text-sm overflow-auto max-h-32">
                  <p className="font-mono text-destructive font-semibold text-xs">
                    {this.state.error.name}: {this.state.error.message}
                  </p>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={this.handleReset} 
                  variant="default"
                  className="flex-1"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  আবার চেষ্টা করুন
                </Button>
                <Button 
                  onClick={this.handleGoBack} 
                  variant="outline"
                  className="flex-1"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  পিছনে যান
                </Button>
              </div>

              <Button 
                onClick={this.handleGoHome} 
                variant="ghost"
                className="w-full"
              >
                <Home className="h-4 w-4 mr-2" />
                হোম পেজে যান
              </Button>

              {/* Reload option */}
              <div className="text-center pt-2">
                <button
                  onClick={this.handleReload}
                  className="text-sm text-primary hover:underline"
                >
                  অথবা পেজ রিফ্রেশ করুন
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default PageErrorBoundary;
