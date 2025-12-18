
import React from 'react';
import { Icon } from './icons';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { cn } from '../utils/shared';

interface BaseModalProps {
  onClose: () => void;
  children: React.ReactNode;
  titleId: string;
  descriptionId?: string; // Novo: permite vincular uma descrição ao diálogo
  containerClassName?: string;
}

const BaseModal: React.FC<BaseModalProps> = ({ 
  onClose, 
  children, 
  titleId, 
  descriptionId, 
  containerClassName = 'max-w-md' 
}) => {
  const modalRef = useFocusTrap<HTMLDivElement>(onClose);
  
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Fecha apenas se clicar no fundo (overlay)
    if (e.target === e.currentTarget) {
        onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] overflow-hidden bg-neutral-900/70 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
    >
      {/* Wrapper para centralizar modal e permitir scroll em conteúdos altos */}
      <div 
        className="flex min-h-[100dvh] items-center justify-center p-4 sm:p-6 text-center overflow-y-auto"
        onClick={handleOverlayClick}
      >
        <div
          ref={modalRef}
          className={cn(
            "relative flex flex-col w-full max-h-[calc(100dvh-2rem)] bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xl shadow-black/20 dark:shadow-neutral-950/50 text-left transition-all animate-scale-in",
            containerClassName
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10">
            <button
                onClick={onClose}
                className="text-neutral-500 hover:text-neutral-800 dark:hover:text-white transition-colors p-1.5 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary bg-white/80 dark:bg-black/40 backdrop-blur-sm"
                aria-label="Fechar modal"
            >
                <Icon name="x" className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
          <div className="overflow-y-auto custom-scrollbar max-h-full">
             {children}
          </div>
        </div>
      </div>

       <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out forwards;
        }
        @keyframes scale-in {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in {
            animation: scale-in 0.2s ease-out forwards;
        }
        /* Scrollbar customizada para modais */
        .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: rgba(156, 163, 175, 0.5);
            border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background-color: rgba(156, 163, 175, 0.7);
        }
      `}</style>
    </div>
  );
};

export default BaseModal;