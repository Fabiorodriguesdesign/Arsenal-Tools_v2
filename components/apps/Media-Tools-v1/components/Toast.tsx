

import React, { useEffect, useState } from 'react';
import { CheckCircleIcon, CloseIcon, AlertTriangleIcon, XCircleIcon } from './icons';

export interface ToastProps {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning';
  onClose: (id: number) => void;
}

const Toast: React.FC<ToastProps> = ({ id, message, type, onClose }) => {
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = () => {
    setIsFadingOut(true);
    // Wait for the fade-out animation to complete before removing from the DOM
    setTimeout(() => {
      onClose(id);
    }, 300); // This duration must match the transition duration in CSS
  };

  const baseClasses = "flex items-center w-full max-w-xs p-4 space-x-3 text-zinc-400 bg-zinc-900/80 backdrop-blur-sm divide-x divide-zinc-700 rounded-lg shadow-2xl ring-1 ring-white/10 transition-all duration-300 ease-in-out";
  const animationClasses = isFadingOut ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0";
  
  const Icon = type === 'success' ? 
    <CheckCircleIcon className="w-6 h-6 text-green-400" /> :
    type === 'warning' ?
    <AlertTriangleIcon className="w-6 h-6 text-amber-400" /> :
    type === 'error' ?
    <XCircleIcon className="w-6 h-6 text-red-400" /> :
    null;

  return (
    <div
      role="alert"
      className={`${baseClasses} ${animationClasses}`}
    >
      <div className="flex-shrink-0">{Icon}</div>
      <div className="pl-3 text-sm font-normal text-zinc-200">{message}</div>
      <div className="pl-3">
          <button onClick={handleClose} className="p-1.5 -m-1.5 rounded-full hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-500">
              <CloseIcon className="w-4 h-4" />
          </button>
      </div>
    </div>
  );
};

export default Toast;