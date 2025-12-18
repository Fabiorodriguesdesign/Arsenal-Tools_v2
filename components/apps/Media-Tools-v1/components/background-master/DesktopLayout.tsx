
import React, { useState } from 'react';
import FileUpload from '../FileUpload';
import SettingsPanel from '../SettingsPanel';
import Preview from '../Preview';
import CompletionMessage from '../common/CompletionMessage';
import ProgressDisplay from '../common/ProgressDisplay';
import ErrorAlert from '../common/ErrorAlert';
import { ImageIcon, LayersIcon, TrashIcon, DownloadIcon, ArrowRightIcon, ArrowLeftIcon } from '../icons';
import { DesktopLayoutProps } from './types';
import SeoTagsGenerator from '../common/SeoTagsGenerator';
import ToolSection from '../common/ToolSection';
import Checkbox from '../Checkbox';

const DesktopLayout: React.FC<DesktopLayoutProps> = ({
    background, foregrounds, settings, isClearDisabled, backgroundUrl, currentForegroundUrl,
    currentPreviewIndex, isProcessing, progress, processedFilesCount, failedFiles, isCompleted,
    buttonText, isGenerateDisabled, t, handleBackgroundAdd, handleBackgroundClear,
    handleForegroundsAdd, handleForegroundRemove, handleForegroundsClear, setAspectRatio, setWidth,
    setHeight, setOutputFormat, setIsDimensionsLinked, setPadding, handleClearAll,
    handleNextPreview, handlePrevPreview, handleGenerate,
    setRenameMode, setBaseName, setSeparator, setTrim, setKeepOriginalName
}) => {
    // Desktop Step State
    const [step, setStep] = useState(1);

    const handleContinue = () => {
        setStep(2);
    };

    const handleBack = () => {
        setStep(1);
    };

    const handleReset = () => {
        handleClearAll();
        setStep(1);
    };

    const canContinue = background !== null && foregrounds.length > 0;

    return (
        <div className="max-w-7xl mx-auto pb-20">
            {/* Step Indicator (Optional for clarity) */}
            <div className="flex items-center justify-center mb-8 gap-4">
                <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary' : 'text-light-muted dark:text-zinc-500'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-primary text-white' : 'bg-neutral-200 dark:bg-zinc-800'}`}>1</div>
                    <span className="font-semibold">Upload</span>
                </div>
                <div className={`w-16 h-0.5 transition-colors ${step > 1 ? 'bg-primary' : 'bg-light-border dark:bg-zinc-800'}`}></div>
                <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary' : 'text-light-muted dark:text-zinc-500'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-primary text-white' : 'bg-neutral-200 dark:bg-zinc-800'}`}>2</div>
                    <span className="font-semibold">Gerar</span>
                </div>
            </div>

            {step === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
                    <div className="flex flex-col gap-6">
                        <ToolSection title={t('chooseBackgroundImage')} className="h-full">
                            <FileUpload
                                title={t('backgroundUploadTitle')}
                                description={t('jpgPngOnly')}
                                onFilesAdd={handleBackgroundAdd}
                                onFilesClear={handleBackgroundClear}
                                onFileRemove={() => { }}
                                acceptedFormats="image/jpeg, image/png"
                                isMultiple={false}
                                uploadedFile={background}
                                icon={<ImageIcon className="w-10 h-10 text-zinc-600" />}
                            />
                        </ToolSection>
                    </div>
                    
                    <div className="flex flex-col gap-6">
                        <ToolSection title={t('selectPNGs')} className="h-full">
                            <FileUpload
                                title={t('selectPNGsUploadTitle')}
                                description={t('transparentPngsOnly')}
                                onFilesAdd={handleForegroundsAdd}
                                onFileRemove={handleForegroundRemove}
                                onFilesClear={handleForegroundsClear}
                                acceptedFormats="image/png"
                                isMultiple={true}
                                uploadedFile={foregrounds}
                                icon={<LayersIcon className="w-10 h-10 text-zinc-600" />}
                            />
                        </ToolSection>
                    </div>

                    <div className="col-span-1 md:col-span-2 flex justify-end mt-4">
                        <button
                            onClick={handleContinue}
                            disabled={!canContinue}
                            className="flex items-center justify-center gap-2 bg-gradient-accent text-white font-bold py-3 px-8 rounded-lg hover:opacity-90 transition-colors disabled:bg-neutral-200 dark:disabled:bg-zinc-800 disabled:text-neutral-500 dark:disabled:text-zinc-500 disabled:cursor-not-allowed text-lg shadow-lg disabled:shadow-none"
                        >
                            Continuar
                            <ArrowRightIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 animate-fade-in">
                    {/* Left Column: Settings */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        <ToolSection title={t('outputSettings')}>
                            <SettingsPanel
                                aspectRatio={settings.aspectRatio} setAspectRatio={setAspectRatio}
                                width={settings.width} setWidth={setWidth}
                                height={settings.height} setHeight={setHeight}
                                outputFormat={settings.outputFormat} setOutputFormat={setOutputFormat}
                                isDimensionsLinked={settings.isDimensionsLinked}
                                setIsDimensionsLinked={setIsDimensionsLinked}
                                padding={settings.padding}
                                setPadding={setPadding}
                                trim={settings.trim}
                                setTrim={setTrim}
                                isSingleImageMode={foregrounds.length === 1}
                            />
                            
                            <div className="mt-6 pt-6 border-t border-light-border dark:border-zinc-800">
                                <h4 className="text-sm font-bold text-light-muted dark:text-zinc-400 uppercase mb-3">Nome do Arquivo de Saída</h4>
                                <div className="grid grid-cols-2 gap-2 mb-3">
                                    <button
                                        onClick={() => setRenameMode('smart')}
                                        className={`px-2 py-2 rounded text-xs font-bold transition-colors border ${settings.renameMode === 'smart' ? 'bg-accent-blue/10 dark:bg-accent-purple/20 text-accent-blue dark:text-accent-purple border-accent-blue/30 dark:border-accent-purple/30' : 'bg-light-bg dark:bg-zinc-800 text-light-muted dark:text-zinc-400 border-light-border dark:border-zinc-700'}`}
                                    >
                                        Modo Inteligente
                                    </button>
                                    <button
                                        onClick={() => setRenameMode('base')}
                                        className={`px-2 py-2 rounded text-xs font-bold transition-colors border ${settings.renameMode === 'base' ? 'bg-accent-blue/10 dark:bg-accent-purple/20 text-accent-blue dark:text-accent-purple border-accent-blue/30 dark:border-accent-purple/30' : 'bg-light-bg dark:bg-zinc-800 text-light-muted dark:text-zinc-400 border-light-border dark:border-zinc-700'}`}
                                    >
                                        Modo Sequencial
                                    </button>
                                </div>
                                {settings.renameMode === 'base' ? (
                                    <div className="space-y-3">
                                        <input 
                                            type="text" 
                                            value={settings.baseName}
                                            onChange={(e) => setBaseName(e.target.value)}
                                            placeholder="Ex: Produto-A"
                                            className="w-full bg-light-input dark:bg-zinc-950 border border-light-border dark:border-zinc-700 rounded-md p-2 text-light-text dark:text-zinc-100 focus:ring-accent-blue focus:border-accent-blue disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={settings.keepOriginalName}
                                        />
                                        <Checkbox
                                            id="keep-original-name"
                                            checked={settings.keepOriginalName}
                                            onChange={(e) => setKeepOriginalName(e.target.checked)}
                                            label="Manter nome original do arquivo"
                                        />
                                        {settings.keepOriginalName && (
                                            <p className="text-[10px] text-light-muted dark:text-zinc-500 italic">
                                                O nome do arquivo de saída será idêntico ao arquivo de entrada (ex: &quot;meu_arquivo.png&quot; &rarr; &quot;meu_arquivo.jpg&quot;).
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex gap-2">
                                        {[' ', '-', '_', '.'].map((sep) => (
                                            <button
                                                key={sep}
                                                onClick={() => setSeparator(sep as any)}
                                                className={`flex-1 py-2 text-xs font-bold rounded border transition-colors ${
                                                    settings.separator === sep 
                                                    ? 'bg-accent-blue border-accent-blue text-white' 
                                                    : 'bg-light-bg dark:bg-zinc-800 border-light-border dark:border-zinc-700 text-light-muted dark:text-zinc-400'
                                                }`}
                                            >
                                                {sep === ' ' ? 'Espaço' : sep}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </ToolSection>

                        {/* SEO Integration */}
                        {foregrounds.length > 0 && (
                            <SeoTagsGenerator files={foregrounds} t={t} />
                        )}
                        
                        <ToolSection>
                             <button
                                onClick={handleBack}
                                disabled={isProcessing}
                                className="w-full flex items-center justify-center gap-2 bg-light-border dark:bg-zinc-800 text-light-text dark:text-zinc-200 font-semibold py-2 px-4 rounded-lg hover:bg-neutral-200 dark:hover:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-2"
                            >
                                <ArrowLeftIcon className="w-5 h-5" />
                                Voltar (Alterar Arquivos)
                            </button>
                            <button
                                onClick={handleReset}
                                disabled={isClearDisabled}
                                className="w-full flex items-center justify-center gap-2 text-light-muted dark:text-zinc-400 font-semibold py-2 px-4 rounded-lg hover:text-red-400 transition-colors disabled:text-neutral-500 dark:disabled:text-zinc-600 disabled:cursor-not-allowed text-sm"
                            >
                                <TrashIcon className="w-4 h-4" />
                                {t('clearSelection')}
                            </button>
                        </ToolSection>
                    </div>
                    
                    {/* Right Column: Preview & Action */}
                    <div className="lg:col-span-3 flex flex-col gap-8">
                        {/* Preview Container with fixed height limitation */}
                        <div className="flex-grow bg-light-bg dark:bg-zinc-950/50 rounded-xl border border-light-border dark:border-zinc-800 p-4 flex items-center justify-center relative overflow-hidden" style={{ maxHeight: '600px', minHeight: '400px' }}>
                            <div className="w-full h-full flex items-center justify-center">
                                <Preview
                                    backgroundUrl={backgroundUrl}
                                    foregroundUrl={currentForegroundUrl}
                                    width={settings.width}
                                    height={settings.height}
                                    totalForegrounds={foregrounds.length}
                                    currentIndex={currentPreviewIndex}
                                    onNext={handleNextPreview}
                                    onPrev={handlePrevPreview}
                                    padding={settings.padding}
                                    trim={settings.trim}
                                />
                            </div>
                        </div>
                        
                        <ToolSection title={t('generateImagesTitle')}>
                            {isCompleted ? (
                                <CompletionMessage onClear={handleReset} t={t} />
                            ) : (
                                <>
                                    {isProcessing && (
                                        <ProgressDisplay
                                            progress={progress}
                                            processedCount={processedFilesCount}
                                            totalFiles={foregrounds.length}
                                            t={t}
                                        />
                                    )}
                                    <ErrorAlert failedFiles={failedFiles} t={t} />
                                    <button
                                        onClick={handleGenerate}
                                        disabled={isGenerateDisabled}
                                        className="w-full flex items-center justify-center gap-2 bg-gradient-accent text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-colors disabled:bg-neutral-300 dark:disabled:bg-zinc-800 disabled:text-neutral-500 dark:disabled:text-zinc-500 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent-blue dark:focus:ring-offset-zinc-900 shadow-lg shadow-accent-blue/20"
                                        aria-label={t('generateAndDownload')}
                                    >
                                        <DownloadIcon className="w-6 h-6" />
                                        {buttonText}
                                    </button>
                                </>
                            )}
                        </ToolSection>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DesktopLayout;