
import React from 'react';
import MobileStepContainer from '../../common/MobileStepContainer';
import Preview from '../../Preview';
import SettingsPanel from '../../SettingsPanel';
import CompletionMessage from '../../common/CompletionMessage';
import ProgressDisplay from '../../common/ProgressDisplay';
import ErrorAlert from '../../common/ErrorAlert';
import ToolSection from '../../common/ToolSection';
import Checkbox from '../../Checkbox';
import { DownloadIcon, ArrowLeftIcon, TrashIcon } from '../../icons';
import { Step3Props } from '../types';

const BackgroundMasterStep3: React.FC<Step3Props> = ({
    backgroundUrl, currentForegroundUrl, width, height, totalForegrounds, currentIndex,
    onNextPreview, onPrevPreview, settings, setAspectRatio, setWidth, setHeight,
    setOutputFormat, setIsDimensionsLinked, setPadding, setRenameMode, setBaseName, setSeparator, setTrim, setKeepOriginalName,
    isProcessing, progress, processedFilesCount,
    failedFiles, isCompleted, handleGenerate, isGenerateDisabled, onPrev, handleClearAll, isClearDisabled, t, buttonText
}) => (
    <div className="flex flex-col gap-8">
        <MobileStepContainer
            stepNumber={3}
            totalSteps={3}
            title={t('previewConfigureGenerate')}
            showNavigation={false}
            t={t}
        >
             {/* Content handled by direct rendering */}
        </MobileStepContainer>
        <Preview
            backgroundUrl={backgroundUrl}
            foregroundUrl={currentForegroundUrl}
            width={width}
            height={height}
            totalForegrounds={totalForegrounds}
            currentIndex={currentIndex}
            onNext={onNextPreview}
            onPrev={onPrevPreview}
            padding={settings.padding}
            trim={settings.trim}
        />
        
        <ToolSection title={t('outputSettings')}>
            <SettingsPanel
                aspectRatio={settings.aspectRatio} setAspectRatio={setAspectRatio}
                width={width} setWidth={setWidth}
                height={height} setHeight={setHeight}
                outputFormat={settings.outputFormat} setOutputFormat={setOutputFormat}
                isDimensionsLinked={settings.isDimensionsLinked}
                setIsDimensionsLinked={setIsDimensionsLinked}
                padding={settings.padding}
                setPadding={setPadding}
                trim={settings.trim}
                setTrim={setTrim}
                isSingleImageMode={totalForegrounds === 1}
            />
             <div className="mt-6 pt-6 border-t border-zinc-800">
                <h4 className="text-sm font-bold text-zinc-400 uppercase mb-3">Nome do Arquivo de Saída</h4>
                <div className="grid grid-cols-2 gap-2 mb-3">
                     <button
                        onClick={() => setRenameMode('smart')}
                        className={`px-2 py-2 rounded text-xs font-bold transition-colors border ${settings.renameMode === 'smart' ? 'bg-[#ff0e00]/20 text-[#ff0e00] border-[#ff0e00]' : 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}
                     >
                         Modo Inteligente
                     </button>
                     <button
                        onClick={() => setRenameMode('base')}
                        className={`px-2 py-2 rounded text-xs font-bold transition-colors border ${settings.renameMode === 'base' ? 'bg-[#ff0e00]/20 text-[#ff0e00] border-[#ff0e00]' : 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}
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
                            className="w-full bg-zinc-950 border border-zinc-700 rounded-md p-2 text-zinc-100 focus:ring-[#ff0e00] focus:border-[#ff0e00] disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={settings.keepOriginalName}
                        />
                        <Checkbox
                            id="keep-original-name-mobile"
                            checked={settings.keepOriginalName}
                            onChange={(e) => setKeepOriginalName(e.target.checked)}
                            label="Manter nome original do arquivo"
                        />
                    </div>
                ) : (
                    <div className="flex gap-2">
                        {[' ', '-', '_', '.'].map((sep) => (
                            <button
                                key={sep}
                                onClick={() => setSeparator(sep as any)}
                                className={`flex-1 py-2 text-xs font-bold rounded border transition-colors ${
                                    settings.separator === sep 
                                    ? 'bg-[#ff0e00] border-[#ff0e00] text-white' 
                                    : 'bg-zinc-800 border-zinc-700 text-zinc-400'
                                }`}
                            >
                                {sep === ' ' ? 'Espaço' : sep}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </ToolSection>

        <ToolSection>
            {isCompleted ? (
                <CompletionMessage onClear={handleClearAll} t={t} />
            ) : (
                <>
                    {isProcessing && (
                        <ProgressDisplay
                            progress={progress}
                            processedCount={processedFilesCount}
                            totalFiles={totalForegrounds}
                            t={t}
                        />
                    )}
                    <ErrorAlert failedFiles={failedFiles} t={t} />
                    <button
                        onClick={handleGenerate}
                        disabled={isGenerateDisabled}
                        className="w-full flex items-center justify-center gap-2 bg-[#ff0e00] text-white font-bold py-3 px-4 rounded-lg hover:bg-[#e00c00] transition-colors disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#ff0e00] dark:focus:ring-offset-zinc-900 shadow-lg shadow-[#ff0e00]/20"
                    >
                        <DownloadIcon className="w-6 h-6" />
                        {buttonText}
                    </button>
                </>
            )}
        </ToolSection>

        <ToolSection>
            <div className="flex justify-between items-center">
                <button
                    onClick={onPrev}
                    className="flex items-center justify-center gap-2 bg-zinc-800 text-zinc-200 font-semibold py-2 px-4 rounded-lg hover:bg-zinc-700 transition-colors"
                >
                    <ArrowLeftIcon className="w-5 h-5" /> {t('back')}
                </button>
                <button
                    onClick={handleClearAll}
                    disabled={isClearDisabled}
                    className="flex items-center justify-center gap-2 text-zinc-400 font-semibold py-2 px-4 rounded-lg hover:bg-zinc-800 transition-colors disabled:text-zinc-600 disabled:cursor-not-allowed"
                >
                    <TrashIcon className="w-5 h-5" /> {t('reset')}
                </button>
            </div>
        </ToolSection>
    </div>
);

export default BackgroundMasterStep3;
