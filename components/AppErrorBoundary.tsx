import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Icon } from './icons';

interface Props {
  children: ReactNode;
  appName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

// FIX: Corrected the class to properly extend React.Component, giving it access to `this.props`.
class AppErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`[AppErrorBoundary] Error in ${this.props.appName}:`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center bg-neutral-50 dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 m-4 animate-fade-in">
          <div className="bg-red-100 dark:bg-red-900/20 p-4 rounded-full mb-4">
            <Icon name="warning" className="w-10 h-10 text-red-600 dark:text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
            Ops! O {this.props.appName || 'Aplicativo'} encontrou um problema.
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6 max-w-md">
            Não se preocupe, seus dados locais estão seguros. Tente recarregar a ferramenta para continuar.
          </p>
          
          {this.state.error && (
            <div className="bg-white dark:bg-black p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 w-full max-w-lg overflow-auto mb-6 text-left shadow-inner">
                <p className="text-xs font-mono text-neutral-500 dark:text-neutral-400 mb-1 uppercase tracking-wider font-bold">Detalhe do Erro:</p>
                <p className="font-mono text-sm text-red-500 break-words">
                    {this.state.error.message || "Erro desconhecido"}
                </p>
            </div>
          )}

          <div className="flex gap-4">
            <button
                onClick={() => window.location.reload()}
                className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-bold shadow-lg shadow-primary/20"
            >
                Recarregar Página
            </button>
            <button
                onClick={() => window.location.hash = '#/'}
                className="px-6 py-2.5 bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors font-semibold"
            >
                Voltar ao Início
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AppErrorBoundary;