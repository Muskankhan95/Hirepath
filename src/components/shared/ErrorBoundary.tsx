import { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '../ui/Button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children?: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('HirePath UI Error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[300px] flex flex-col items-center justify-center p-8 text-center bg-rose-50/50 dark:bg-rose-950/20 rounded-2xl border border-rose-200 dark:border-rose-900/50 m-4">
          <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-3">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {this.props.fallbackTitle || 'Something went wrong in this module'}
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-md">
            {this.state.error?.message || 'An unexpected rendering error occurred. You can safely reload the view.'}
          </p>
          <Button
            onClick={() => {
              this.setState({ hasError: false });
              window.location.reload();
            }}
            variant="outline"
            size="sm"
            className="mt-4 gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reload Component
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
