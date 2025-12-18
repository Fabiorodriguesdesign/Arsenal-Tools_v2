import React from 'react';
import { Icon } from '../icons';

interface NotificationProps {
  message: string;
  type: 'success' | 'info';
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, type, onClose }) => {
  const icon =
    type === 'success' ? (
      <Icon name="check-circle" className="w-6 h-6 text-green-500 dark:text-green-400" />
    ) : (
      <Icon name="info" className="w-6 h-6 text-blue-500 dark:text-blue-400" />
    );
  
  const baseClasses = "fixed bottom-5 right-5 z-[100] flex items-center gap-4 p-4 rounded-lg shadow-lg animate-slide-in-up w-full max-w-sm";
  const typeClasses = type === 'success' 
    ? 'bg-white dark:bg-neutral-900 border border-green-500/30' 
    : 'bg-white dark:bg-neutral-900 border border-blue-500/30';

  return (
    <div className={`${baseClasses} ${typeClasses}`} role="alert">
      {icon}
      <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">{message}</p>
      <button onClick={onClose} className="ml-auto text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-white transition-colors flex-shrink-0" aria-label="Fechar notificação">
        <Icon name="x" className="w-5 h-5" />
      </button>
      <style>{`
        @keyframes slide-in-up {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-in-up {
          animation: slide-in-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Notification;