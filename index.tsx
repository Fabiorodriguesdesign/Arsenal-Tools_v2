// Triggering a change for Git detection.
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import AppProviders from './AppProviders';
import GlobalErrorBoundary from './components/GlobalErrorBoundary';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <GlobalErrorBoundary>
      <AppProviders>
        <App />
      </AppProviders>
    </GlobalErrorBoundary>
  </React.StrictMode>
);