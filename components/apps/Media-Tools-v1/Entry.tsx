
import React, { Suspense } from 'react';
import { Loading } from '../../ui/Loading';
import { Tab } from './types';
import { LanguageProvider } from './contexts/LanguageContext';
import { ToastProvider } from './contexts/ToastContext';

// Lazy load the main App component of Media Tools
const MediaToolsApp = React.lazy(() => import('./App'));

interface MediaToolsEntryProps {
  initialTool?: Tab;
}

export default function MediaToolsEntry({ initialTool }: MediaToolsEntryProps) {
  return (
    <LanguageProvider>
      <ToastProvider>
        <Suspense fallback={<Loading fullScreen text="Iniciando motor de mídia..." />}>
          <MediaToolsApp initialTool={initialTool} />
        </Suspense>
      </ToastProvider>
    </LanguageProvider>
  );
}
