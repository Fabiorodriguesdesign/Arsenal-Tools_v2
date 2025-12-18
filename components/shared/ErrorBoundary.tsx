import React, { Component, ErrorInfo, ReactNode } from 'react';
import { translations } from '../../locales/translations';
import { Button } from '../ui/Button';

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

// Fix: Define getLanguage function to safely retrieve language from localStorage or default to 'pt'.
const getLanguage = (): 'pt' | 'en' | 'es' => {
  if (typeof window !== 'undefined') {
    const savedLang = window.localStorage.getItem('language');
    if (savedLang === 'pt' || savedLang === 'en' || savedLang === 'es') {
      return savedLang;
    }
  }
  return 'pt'; // Default to Portuguese
};

// FIX: Corrected the class to properly extend React.Component, giving it access to `this.props`.
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  handleRetry = () => {
    window.location.reload();
  }

  handleClearStorage = () => {
    localStorage.clear();
    window.location.reload();
  }

  render() {
    if (this.state.hasError) {
      // Fix: Use the defined getLanguage function.
      const lang = getLanguage();
      // Access translations dynamically based on the resolved language.
      const t = (translations as any)[lang] || translations.pt;

      return (
        <div className="min-h-screen flex items-center justify-center bg-light-bg dark:bg-dark-bg p-4">
          <div className="bg-light-card dark:bg-dark-card p-8 rounded-xl shadow-2xl max-w-md w-full text-center border border-light-border dark:border-dark-border">
             <div className="mb-6 flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-danger">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
             </div>
            <h1 className="text-2xl font-bold text-light-text dark:text-dark-text mb-4">
              {t['error.boundary.title'] || 'Ops! Algo deu errado.'}
            </h1>
            <p className="text-light-muted dark:text-dark-muted mb-8">
              {t['error.boundary.message'] || 'Ocorreu um erro inesperado.'}
            </p>
            <div className="space-y-3">
              <Button onClick={this.handleRetry} className="w-full">
                {t['error.boundary.retry'] || 'Tentar Novamente'}
              </Button>
              <Button onClick={this.handleClearStorage} variant="secondary" className="w-full">
                {t['error.boundary.clearStorage'] || 'Limpar Dados e Recarregar'}
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;