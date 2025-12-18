import React from 'react';
import { ToastMessage } from '../../context/ToastContext';
import Toast from './Toast';

interface ToastContainerProps {
  messages: ToastMessage[];
  removeToast: (id: number) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ messages, removeToast }) => {
  return (
    <div className="fixed top-5 right-5 z-[100] w-full max-w-xs sm:max-w-sm space-y-3">
      {messages.map((message) => (
        <Toast key={message.id} message={message} onDismiss={() => removeToast(message.id)} />
      ))}
    </div>
  );
};

export default ToastContainer;
