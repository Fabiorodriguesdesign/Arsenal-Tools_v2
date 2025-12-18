

import React, { createContext, useState, useContext, ReactNode } from 'react';
import Toast, { ToastProps } from '../components/Toast';

type ToastContextType = {
  addToast: (message: string, type: 'success' | 'error' | 'warning') => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

type ToastState = Omit<ToastProps, 'onClose'>;

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastState[]>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'warning') => {
    const id = Date.now() + Math.random();
    setToasts(prevToasts => [...prevToasts, { id, message, type }]);
  };

  const removeToast = (id: number) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col items-end space-y-2">
        {toasts.map(toast => (
          <Toast key={toast.id} {...toast} onClose={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};