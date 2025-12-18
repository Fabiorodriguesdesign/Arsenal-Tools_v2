
import React, { createContext, useContext, useState, useCallback, ReactNode, useMemo } from 'react';
import ToastContainer from '../components/apps/Media-Tools-v1/components/Toast'; // Reutilizando componente visual existente ou criando um novo se necessário
// Nota: O ToastContainer original do media tools era interno. Vamos adaptar para usar o global se existir, ou manter a lógica simples aqui.
// Para este refactor, manteremos a lógica de estado e renderização simples.

// Ajuste: Importando o Toast componente visual correto. 
// Como o arquivo ToastContainer não estava no contexto global original listado, vou renderizar a lista diretamente ou usar o Toast component se disponível.
import Toast from '../components/apps/Media-Tools-v1/components/Toast'; 

type ToastType = 'success' | 'error' | 'warning';

export interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  addToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((message: string, type: ToastType) => {
    const id = Date.now() + Math.random();
    setToasts(prevToasts => [...prevToasts, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }, []);

  const value = useMemo(() => ({ addToast }), [addToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col items-end space-y-2 pointer-events-none">
        {toasts.map(toast => (
          <div key={toast.id} className="pointer-events-auto">
             <Toast id={toast.id} message={toast.message} type={toast.type} onClose={removeToast} />
          </div>
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
