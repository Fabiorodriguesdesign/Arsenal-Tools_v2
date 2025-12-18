import React, { useEffect, useState } from 'react';
import { ToastMessage } from '../../context/ToastContext';
import { useTranslation } from '../../hooks/useTranslation';
import { SuccessIcon, CloseIconSmall } from './Icons';


interface ToastProps {
  message: ToastMessage;
  onDismiss: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, onDismiss }) => {
  const [isExiting, setIsExiting] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const timer = setTimeout(() => {
        setIsExiting(true);
        setTimeout(onDismiss, 300); // Wait for exit animation
    }, message.duration || 3000);

    return () => clearTimeout(timer);
  }, [message, onDismiss]);
  
  const handleDismiss = () => {
      setIsExiting(true);
      setTimeout(onDismiss, 300);
  }

  const baseClasses = 'w-full bg-light-card dark:bg-dark-card shadow-lg rounded-lg pointer-events-auto ring-1 ring-black dark:ring-white ring-opacity-5 dark:ring-opacity-10 overflow-hidden flex items-start p-4 space-x-3 transition-all duration-300 ease-in-out';
  const animationClasses = `transform ${isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'}`;
  
  const icons = {
      success: <SuccessIcon />,
      error: <div>E</div>, // placeholder
      info: <div>I</div>, // placeholder
  }

  // Determine accessibility roles based on message type
  const role = message.type === 'error' ? 'alert' : 'status';
  const ariaLive = message.type === 'error' ? 'assertive' : 'polite';

  return (
    <div 
      className={`${baseClasses} ${animationClasses}`}
      role={role}
      aria-live={ariaLive}
    >
        <div className="flex-shrink-0" aria-hidden="true">{icons[message.type]}</div>
        <div className="flex-1">
            <p className="text-sm font-medium text-light-text dark:text-dark-text">{message.message}</p>
        </div>
        <div className="flex-shrink-0 -mr-1 -mt-1">
            <button 
              onClick={handleDismiss} 
              className="p-1 rounded-full text-light-muted hover:bg-light-border dark:hover:bg-dark-border dark:text-dark-muted"
              aria-label={t('toast.close')}
            >
                <CloseIconSmall />
            </button>
        </div>
    </div>
  );
};

export default Toast;