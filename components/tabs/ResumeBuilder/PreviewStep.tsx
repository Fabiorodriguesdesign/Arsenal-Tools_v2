import React, { useState, useEffect } from 'react';
import { ResumeData } from '../../../types/resume';
import ResumePreview from './ResumePreview';
import { useTranslation } from '../../../hooks/useTranslation';
import Button from '../../shared/Button';
import { EnterFullscreenIcon, CloseIcon } from '../../shared/Icons';

interface PreviewStepProps {
  data: ResumeData;
}

const PreviewStep: React.FC<PreviewStepProps> = ({ data }) => {
  const { t } = useTranslation();
  const [isPreviewFullscreen, setIsPreviewFullscreen] = useState(false);

  // Handle fullscreen state, body scroll, and ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsPreviewFullscreen(false);
      }
    };

    if (isPreviewFullscreen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPreviewFullscreen]);

  return (
    <div className="animate-fadeIn">
      {/* Controls for this step */}
      <div className="flex justify-end mb-4">
        <Button variant="secondary" size="sm" onClick={() => setIsPreviewFullscreen(true)} className="gap-2">
            <EnterFullscreenIcon />
            <span className="hidden sm:inline">{t('resumeBuilder.preview.fullscreen')}</span>
        </Button>
      </div>

      {/* Resume Preview Area (A4 Aspect Ratio Container) */}
      <div className="w-full overflow-x-auto bg-gray-100 dark:bg-gray-800 p-4 md:p-8 rounded-xl flex justify-center">
        <div className="min-w-[800px] w-[800px] min-h-[1131px] bg-white shadow-2xl origin-top transform scale-[0.8] lg:scale-95 transition-transform duration-300">
             <ResumePreview data={data} />
        </div>
      </div>

      {/* Fullscreen Modal */}
      {isPreviewFullscreen && (
        <div 
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 animate-fadeIn" 
            role="dialog" 
            aria-modal="true"
            onClick={() => setIsPreviewFullscreen(false)}
        >
            <button
                onClick={() => setIsPreviewFullscreen(false)}
                className="absolute top-4 right-4 text-white hover:text-gray-300 p-2 rounded-full bg-white/10 z-10"
                aria-label={t('common.close')}
            >
                <CloseIcon />
            </button>
            
            <div 
                className="relative w-full h-full flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="w-auto h-full max-h-[95vh] aspect-[210/297] bg-white shadow-2xl overflow-y-auto">
                     <ResumePreview data={data} />
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default PreviewStep;