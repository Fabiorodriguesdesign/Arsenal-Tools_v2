import React, { Component, ErrorInfo, ReactNode } from 'react';

interface GlobalErrorBoundaryProps {
  children?: ReactNode;
}

interface GlobalErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

// FIX: Corrected the class to properly extend React.Component, giving it access to `this.props` and `this.setState`.
class GlobalErrorBoundary extends React.Component<GlobalErrorBoundaryProps, GlobalErrorBoundaryState> {
  state: GlobalErrorBoundaryState = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  static getDerivedStateFromError(error: Error): Partial<GlobalErrorBoundaryState> {
    return { hasError: true, error: error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-neutral-950 p-4 font-sans text-neutral-900 dark:text-white">
          <div className="bg-white dark:bg-neutral-900 p-8 rounded-xl shadow-2xl max-w-lg w-full border border-red-100 dark:border-red-900/30">
            <div className="flex items-center gap-3 mb-4 text-red-600 dark:text-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h1 className="text-2xl font-bold">Ops! Algo deu errado.</h1>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              O aplicativo encontrou um erro inesperado e precisou ser interrompido para sua segurança.
            </p>

            {this.state.error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-100 dark:border-red-900/30 overflow-auto max-h-40">
                <p className="font-mono text-xs text-red-800 dark:text-red-300 break-words">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors shadow-lg shadow-red-600/20"
              >
                Recarregar Página
              </button>
              <button
                onClick={() => window.location.hash = ''}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-neutral-800 hover:bg-gray-300 dark:hover:bg-neutral-700 text-gray-800 dark:text-white rounded-lg font-semibold transition-colors"
              >
                Voltar ao Início
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default GlobalErrorBoundary;