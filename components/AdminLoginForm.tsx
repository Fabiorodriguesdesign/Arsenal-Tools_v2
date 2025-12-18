
import React, { useState } from 'react';
import { Icon } from './icons';
import { useAuth } from '../contexts/AuthContext';
import { useModal } from '../contexts/ModalContext';
import { useLanguage } from '../contexts/LanguageContext';

const AdminLoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  
  const { login } = useAuth();
  const { closeModal } = useModal();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login(email, password);
      closeModal();
      // Redireciona automaticamente para o dashboard após login
      window.location.hash = '/admindash';
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(t('unexpectedError'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 id="auth-modal-title" className="font-bold text-3xl text-center text-neutral-900 dark:text-white">{t('adminLoginTitle')}</h2>
      <p className="text-center text-neutral-600 dark:text-neutral-400 mt-2">{t('adminLoginSubtitle')}</p>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm text-center">
                {error}
            </div>
        )}
        <div className="space-y-4">
          <div>
            <label htmlFor="admin-email" className="sr-only">Email</label>
            <input 
                id="admin-email" 
                name="email" 
                type="email" 
                autoComplete="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white placeholder-neutral-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue dark:focus-visible:ring-accent-purple" 
                placeholder="Email" 
            />
          </div>
          <div className="relative">
            <label htmlFor="admin-password" className="sr-only">Senha</label>
            <input 
                id="admin-password" 
                name="password" 
                type={isPasswordVisible ? 'text' : 'password'} 
                autoComplete="current-password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white placeholder-neutral-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue dark:focus-visible:ring-accent-purple pr-10" 
                placeholder="Senha" 
            />
            <button
              type="button"
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              className="absolute inset-y-0 right-0 px-3 flex items-center text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 rounded-r-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue dark:focus-visible:ring-accent-purple"
              aria-label={isPasswordVisible ? "Ocultar senha" : "Mostrar senha"}
            >
              {isPasswordVisible ? <Icon name="eye-off" className="h-5 w-5" /> : <Icon name="eye" className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div className="pt-2">
          <button 
            type="submit" 
            disabled={isLoading} 
            className="w-full font-bold py-3 px-4 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent-blue dark:focus-visible:ring-accent-purple focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900 disabled:bg-neutral-600 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              t('adminLoginButton')
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminLoginForm;