
import React, { useRef, useState, useEffect } from 'react';
import { LogoIcon, Icon } from './icons';
import { SiteContent } from '../types';
import LoadingSpinner from './ui/LoadingSpinner';
import { useModal } from '../contexts/ModalContext';
import { useToast } from '../contexts/ToastContext';

interface SettingsProps {
    siteContent: SiteContent;
    onUpdateSiteContent: (newContent: Partial<SiteContent>) => Promise<void>;
    onSeedDatabase: () => Promise<void>;
    onRefreshData: () => Promise<void>;
}

const Settings: React.FC<SettingsProps> = ({ siteContent, onUpdateSiteContent, onSeedDatabase, onRefreshData }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [content, setContent] = useState(siteContent);
    const [hasChanges, setHasChanges] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isMigrating, setIsMigrating] = useState(false);
    const { openModal } = useModal();
    const { addToast } = useToast();

    useEffect(() => {
        setContent(siteContent);
        setHasChanges(false);
    }, [siteContent]);

    const handleContentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setContent(prev => ({ ...prev, [name]: value }));
        setHasChanges(true);
    };

    const handleContentSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await onUpdateSiteContent(content);
            setHasChanges(false);
        } finally {
            setIsSaving(false);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();

        if (file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg')) {
            reader.onload = (e) => {
                const svgContent = e.target?.result as string;
                if (svgContent) {
                    onUpdateSiteContent({ logo_svg: svgContent });
                }
            };
            reader.readAsText(file);
        } else if (file.type.startsWith('image/')) {
            reader.onload = (e) => {
                const dataUrl = e.target?.result as string;
                if (dataUrl) {
                    onUpdateSiteContent({ logo_svg: dataUrl });
                }
            };
            reader.readAsDataURL(file);
        } else {
            alert('Formato de arquivo não suportado. Use SVG, PNG, ou JPG.');
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleMigration = () => {
        openModal('confirmation', {
            title: 'Confirmar Reset do Banco de Dados',
            message: 'Esta ação irá DELETAR TODOS OS DADOS ATUAIS (Ferramentas, Leads, Conteúdo do Site) e recriá-los com os dados padrão. Deseja continuar?',
            confirmText: 'Sim, Resetar Dados',
            onConfirm: async () => {
                setIsMigrating(true);
                try {
                    await onSeedDatabase();
                    await onRefreshData();
                    addToast('Banco de dados resetado e preenchido com sucesso!', 'success');
                } catch (error) {
                    console.error("Erro ao migrar dados:", error);
                    addToast('Erro ao migrar dados para o banco. Verifique o console para mais detalhes.', 'error');
                } finally {
                    setIsMigrating(false);
                }
            },
        });
    };

    return (
        <section>
            <div className="mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">Configurações</h1>
              <p className="mt-1 text-neutral-600 dark:text-neutral-400">Gerencie o conteúdo do site e as configurações do banco de dados.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Coluna Principal */}
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800">
                        <form onSubmit={handleContentSave}>
                            <div className="p-6 sm:p-8">
                                <h3 className="font-bold text-lg text-neutral-900 dark:text-white mb-2">Conteúdo da Home Page</h3>
                                <p className="text-neutral-600 dark:text-neutral-400 mb-6">Edite os principais textos da página inicial.</p>
                                
                                <div className="space-y-6">
                                    {/* Seção Principal */}
                                    <div>
                                        <h4 className="font-semibold text-neutral-700 dark:text-neutral-300 mb-3">Seção Principal</h4>
                                        <div className="space-y-4">
                                            <div>
                                                <label htmlFor="main_title" className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">Título Principal</label>
                                                <input id="main_title" name="main_title" type="text" value={content.main_title} onChange={handleContentChange} className="w-full px-3 py-2 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-md text-base text-neutral-800 dark:text-neutral-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-primary" />
                                            </div>
                                            <div>
                                                <label htmlFor="main_subtitle" className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">Subtítulo Principal</label>
                                                <textarea id="main_subtitle" name="main_subtitle" value={content.main_subtitle} onChange={handleContentChange} rows={2} className="w-full px-3 py-2 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-md text-base text-neutral-800 dark:text-neutral-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-primary" />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <hr className="border-neutral-200 dark:border-neutral-800" />

                                    {/* Seção Freemium */}
                                    <div>
                                        <h4 className="font-semibold text-neutral-700 dark:text-neutral-300 mb-3">Seção Freemium</h4>
                                        <div className="space-y-4">
                                             <div>
                                                <label htmlFor="freemium_title" className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">Título Freemium</label>
                                                <input id="freemium_title" name="freemium_title" type="text" value={content.freemium_title} onChange={handleContentChange} className="w-full px-3 py-2 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-md text-base text-neutral-800 dark:text-neutral-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-primary" />
                                            </div>
                                            <div>
                                                <label htmlFor="freemium_subtitle" className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">Subtítulo Freemium</label>
                                                <textarea id="freemium_subtitle" name="freemium_subtitle" value={content.freemium_subtitle} onChange={handleContentChange} rows={2} className="w-full px-3 py-2 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-md text-base text-neutral-800 dark:text-neutral-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-primary" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Outras seções... */}
                                </div>
                            </div>
                            <div className="bg-neutral-50 dark:bg-neutral-800/50 px-6 py-4 flex justify-end rounded-b-lg border-t border-neutral-200 dark:border-neutral-800">
                                <button
                                    type="submit"
                                    disabled={!hasChanges || isSaving}
                                    className="px-6 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark transition-colors disabled:bg-neutral-400 dark:disabled:bg-neutral-600 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary dark:focus-visible:ring-offset-neutral-900"
                                >
                                    {isSaving ? 'Salvando...' : 'Salvar Conteúdo'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Coluna Lateral */}
                <div className="lg:col-span-1 space-y-8">
                     <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
                        <h3 className="font-bold text-lg text-neutral-900 dark:text-white mb-2">Logo do Site</h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">Faça o upload do logo exibido no cabeçalho.</p>

                        <div className="flex flex-col items-center gap-4">
                            <div className="w-24 h-24 bg-neutral-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center p-2 border border-neutral-200 dark:border-neutral-700">
                                <LogoIcon logo={siteContent.logo_svg} className="w-full h-full" />
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/svg+xml, image/png, image/jpeg"
                                className="hidden"
                            />
                            <button
                                onClick={handleUploadClick}
                                className="w-full text-sm font-bold py-2 px-4 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-white rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-neutral-500 dark:focus-visible:ring-offset-neutral-900"
                            >
                                Fazer Upload
                            </button>
                        </div>
                    </div>

                    <div className="bg-red-500/5 dark:bg-red-900/10 rounded-lg border border-red-500/20 p-6">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 text-red-500 dark:text-red-400">
                                <Icon name="warning" className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-red-800 dark:text-red-300">Zona de Perigo</h3>
                                <p className="text-sm text-red-700 dark:text-red-400 mt-2 mb-4">Resetar o banco de dados irá apagar todos os dados atuais e preenchê-los com os dados de exemplo.</p>
                                <button
                                    onClick={handleMigration}
                                    disabled={isMigrating}
                                    className="inline-flex items-center justify-center w-full px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:bg-red-400 dark:disabled:bg-red-800 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500 dark:focus-visible:ring-offset-neutral-900"
                                >
                                    {isMigrating ? (
                                        <>
                                            <LoadingSpinner className="w-4 h-4 mr-2" />
                                            Resetando...
                                        </>
                                    ) : (
                                        'Resetar Banco de Dados'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Settings;