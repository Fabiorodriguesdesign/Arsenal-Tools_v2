
import React, { useState } from 'react';
import { Icon } from './icons';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '../contexts/ToastContext';
import { SupabaseService } from '../services/supabaseService';
import { FeedbackType } from '../types';

const FeedbackWidget: React.FC = () => {
    const { t } = useLanguage();
    const { addToast } = useToast();
    const [isOpen, setIsOpen] = useState(false);
    const [type, setType] = useState<FeedbackType>('suggestion');
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;

        setIsSending(true);
        try {
            await SupabaseService.addFeedback({
                type,
                message,
                page_url: window.location.hash
            });
            addToast("Feedback enviado com sucesso! Obrigado.", 'success');
            setIsOpen(false);
            setMessage('');
            setType('suggestion');
        } catch (error) {
            addToast("Erro ao enviar feedback.", 'error');
            console.error(error);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-24 left-6 z-50 group flex items-center justify-center w-10 h-10 bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 rounded-full shadow-lg border border-neutral-200 dark:border-neutral-700 hover:scale-110 hover:shadow-xl transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                title="Enviar Feedback"
            >
                <Icon name="message-square" className="w-5 h-5" />
                <span className="absolute left-full ml-3 px-3 py-1.5 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-white text-xs font-bold rounded-lg shadow-lg border border-neutral-100 dark:border-neutral-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none transform translate-x-[-10px] group-hover:translate-x-0">
                    Feedback
                </span>
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:justify-start pointer-events-none">
                    <div 
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm pointer-events-auto" 
                        onClick={() => setIsOpen(false)}
                    ></div>
                    
                    <div className="relative pointer-events-auto w-full sm:w-80 bg-white dark:bg-neutral-900 rounded-t-2xl sm:rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 p-6 m-0 sm:m-6 sm:mb-32 animate-slide-in-up">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-lg text-neutral-900 dark:text-white">Enviar Feedback</h3>
                            <button onClick={() => setIsOpen(false)} className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 p-1 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                                <Icon name="x" className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Tipo</label>
                                <div className="flex gap-2">
                                    {(['bug', 'suggestion', 'other'] as const).map((t) => (
                                        <button
                                            key={t}
                                            type="button"
                                            onClick={() => setType(t)}
                                            className={`flex-1 py-1.5 px-2 text-xs font-medium rounded-lg border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary dark:focus-visible:ring-offset-neutral-900 ${
                                                type === t 
                                                ? 'bg-primary text-white border-primary' 
                                                : 'bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                                            }`}
                                        >
                                            {t === 'bug' ? 'Erro' : t === 'suggestion' ? 'Sugestão' : 'Outro'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Mensagem</label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Descreva sua sugestão ou o problema encontrado..."
                                    rows={4}
                                    className="w-full p-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus:border-transparent resize-none"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSending || !message.trim()}
                                className="w-full py-2.5 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary dark:focus-visible:ring-offset-neutral-900"
                            >
                                {isSending ? 'Enviando...' : 'Enviar Feedback'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default FeedbackWidget;