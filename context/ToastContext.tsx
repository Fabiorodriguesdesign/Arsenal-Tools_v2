import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import ToastContainer from '../components/shared/ToastContainer';

type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextData {
  addToast: (message: string, type: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextData>({} as ToastContextData);

let idCounter = 0;

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const addToast = useCallback((message: string, type: ToastType, duration: number = 3000) => {
    const id = idCounter++;
    const toast: ToastMessage = { id, message, type, duration };
    setMessages((prevMessages) => [...prevMessages, toast]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setMessages((prevMessages) => prevMessages.filter((message) => message.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <ToastContainer messages={messages} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

export function useToast(): ToastContextData {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
