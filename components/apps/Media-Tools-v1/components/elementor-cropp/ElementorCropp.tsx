
import React from 'react';
import FileUpload from '../FileUpload';
import ToolSection from '../common/ToolSection';
import Checkbox from '../Checkbox';
import { CropIcon, DownloadIcon, RefreshIcon, LinkIcon, UnlinkIcon, ArrowLeftIcon, ArrowRightIcon, TrashIcon } from '../icons';
import { NumberInput } from '../../../../ui/NumberInput';
import ProgressDisplay from '../common/ProgressDisplay';
import { Select } from '../../../../ui/Select';
import SeoTagsGenerator from '../common/SeoTagsGenerator';
import { useElementorCropp, ResizeMode, SeparatorType, RenameMode } from '../../hooks/useElementorCropp';

const MAX_DIMENSION = 8000;

const ElementorCropp: React.FC = () => {
    const {
        files, padding, width, height, trim, baseName, resizeMode, renameMode, isLinked, previewIndex, nameSeparator, isProcessing, progress, processedFilesCount,
        setPadding, setTrim, setBaseName, setResizeMode, setRenameMode, setIsLinked, setNameSeparator,
        handleFilesAdd, handleFileRemove, handleReset, handleDimensionChange, handleNextPreview, handlePrevPreview, handleProcess,
        canvasRef,
        t, getPreviewName
    } = useElementorCropp();

    return (
        <div className="max-w-6xl mx-auto flex flex-col gap-8 pb-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column: Controls */}
                <div className="flex flex-col gap-6">
                    <ToolSection title={t('uploadImages')}>
                        <FileUpload
                            title={t('selectPNGs')}
                            description={t('transparentPngsOnly')}
                            onFilesAdd={handleFilesAdd}
                            onFileRemove={handleFileRemove}
                            onFilesClear={handleReset}
                            acceptedFormats=".png"
                            isMultiple={true}
                            uploadedFile={files}
                            icon={<CropIcon className="w-10 h-10 text-zinc-600" />}
                        />
                    </ToolSection>

                    <ToolSection title={t('trimOptions')}>
                        <div className="space-y-6">
                            <div className="flex flex-col gap-4">
                                <Select
                                    label="Modo de Redimensionamento"
                                    value={resizeMode}
                                    onChange={(e) => setResizeMode(e.target.value as ResizeMode)}
                                >
                                    <option value="custom">Tamanho Fixo (Custom)</option>
                                    <option value="fixed-width">Largura Fixa (Altura Auto)</option>
                                    <option value="original">Tamanho Original (Sem Resize)</option>
                                </Select>

                                <Checkbox 
                                    checked={trim} 
                                    onChange={(e) => setTrim(e.target.checked)}
                                    label={
                                        <div>
                                            <span className="text-zinc-200 font-medium">{t('trim')}</span>
                                            <p className="text-xs text-zinc-500">{t('trimDesc')}</p>
                                        </div>
                                    }
                                />
                            </div>
                            
                            <div className="border-t border-zinc-800 pt-4">
                                <h4 className="text-sm font-bold text-zinc-400 uppercase mb-3">Configurações de Layout</h4>
                                <div className="mb-4">
                                     <NumberInput
                                        label={t('padding')}
                                        value={padding}
                                        onChange={setPadding}
                                        min={0}
                                        max={1000}
                                        step={50}
                                    />
                                    <p className="text-xs text-zinc-500 mt-1">{t('paddingDesc')}</p>
                                </div>
                                {resizeMode !== 'original' && (
                                    <>
                                    <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-end">
                                        <NumberInput
                                            label={t('widthPx')}
                                            value={width}
                                            onChange={(val) => handleDimensionChange('width', val)}
                                            min={100}
                                            max={MAX_DIMENSION}
                                            step={100} 
                                        />
                                        {resizeMode === 'custom' ? (
                                            <button
                                                onClick={() => setIsLinked(!isLinked)}
                                                className={`p-2 mb-[2px] rounded-md transition-colors ${isLinked ? 'text-[#ff0e00] bg-[#ff0e00]/10' : 'text-zinc-500 hover:text-zinc-300'}`}
                                                title={isLinked ? "Desvincular dimensões" : "Vincular dimensões"}
                                            >
                                                {isLinked ? <LinkIcon className="w-5 h-5" /> : <UnlinkIcon className="w-5 h-5" />}
                                            </button>
                                        ) : (
                                            <div className="w-9"></div>
                                        )}
                                        <NumberInput
                                            label={t('heightPx')}
                                            value={height}
                                            onChange={(val) => handleDimensionChange('height', val)}
                                            min={100}
                                            max={MAX_DIMENSION}
                                            step={100} 
                                            disabled={resizeMode === 'fixed-width'}
                                            containerClassName={resizeMode === 'fixed-width' ? 'opacity-50' : ''}
                                        />
                                    </div>
                                     <p className="text-[10px] text-zinc-500 text-center mt-2">{t('dimensionLimit', { limit: MAX_DIMENSION })}</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </ToolSection>
                </div>

                {/* Right Column: Preview & Action */}
                <div className="flex flex-col gap-6">
                    <ToolSection title={t('previewResult')}>
                         <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 flex flex-col items-center justify-center min-h-[350px] overflow-hidden relative">
                            {files.length > 0 ? (
                                <>
                                    <div className="flex-grow flex items-center justify-center w-full">
                                        <canvas 
                                            ref={canvasRef} 
                                            className="max-w-full max-h-[300px] h-auto w-auto object-contain shadow-lg border border-zinc-800 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZHRoPSIyMCI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjMjIyIiAvPjxyZWN0IHg9IjEwIiB5PSIxMCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjMjIyIiAvPjwvc3ZnPg==')] bg-repeat"
                                        />
                                    </div>
                                    
                                    {files.length > 1 && (
                                        <div className="flex items-center justify-between w-full max-w-[200px] mt-4 bg-zinc-900 rounded-full px-2 py-1 border border-zinc-800 shadow-lg">
                                            <button 
                                                onClick={handlePrevPreview}
                                                className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                                                title="Anterior"
                                            >
                                                <ArrowLeftIcon className="w-5 h-5" />
                                            </button>
                                            <span className="text-xs font-mono text-zinc-300 select-none">
                                                {previewIndex + 1} / {files.length}
                                            </span>
                                            <button 
                                                onClick={handleNextPreview}
                                                className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                                                title="Próximo"
                                            >
                                                <ArrowRightIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    )}
                                    
                                    <div className="text-center mt-2">
                                        <p className="text-xs text-zinc-400">
                                            Original: <span className="text-zinc-500">{files[previewIndex]?.name}</span>
                                        </p>
                                        <p className="text-xs text-zinc-200 mt-1 font-semibold">
                                            Saída: <span className="text-[#ff0e00]">{getPreviewName()}</span>
                                        </p>
                                    </div>
                                </>
                            ) : (
                                <p className="text-zinc-500">{t('noFilesSelected')}</p>
                            )}
                         </div>
                    </ToolSection>

                    <ToolSection title={t('outputName')}>
                        <div className="space-y-4">
                             {/* Renaming Mode Toggle */}
                            <div className="grid grid-cols-2 gap-4 mb-2">
                                <button
                                    onClick={() => setRenameMode('smart')}
                                    className={`p-3 rounded-lg border transition-all flex flex-col items-center justify-center gap-1 ${
                                        renameMode === 'smart' 
                                        ? 'border-[#ff0e00] bg-[#ff0e00]/10 text-white' 
                                        : 'border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-500'
                                    }`}
                                >
                                    <span className="font-bold text-xs">Modo Inteligente</span>
                                    <span className="text-[10px] opacity-70">Limpa o nome original</span>
                                </button>
                                <button
                                    onClick={() => setRenameMode('base')}
                                    className={`p-3 rounded-lg border transition-all flex flex-col items-center justify-center gap-1 ${
                                        renameMode === 'base' 
                                        ? 'border-[#ff0e00] bg-[#ff0e00]/10 text-white' 
                                        : 'border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-500'
                                    }`}
                                >
                                    <span className="font-bold text-xs">Modo Sequencial</span>
                                    <span className="text-[10px] opacity-70">Nome único + contador</span>
                                </button>
                            </div>

                             <div>
                                <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                                    {renameMode === 'base' ? 'Nome Base do Arquivo' : 'Separador de Palavras'}
                                </label>
                                
                                {renameMode === 'base' ? (
                                    <input 
                                        type="text"
                                        value={baseName}
                                        onChange={(e) => setBaseName(e.target.value)}
                                        placeholder="Ex: Produto-A"
                                        className="w-full bg-zinc-950 border border-zinc-700 rounded-md p-2 text-zinc-100 focus:ring-[#ff0e00] focus:border-[#ff0e00]"
                                    />
                                ) : (
                                    <div className="flex items-center gap-2 flex-wrap p-2 bg-zinc-950 border border-zinc-700 rounded-md">
                                        <span className="text-xs text-zinc-400 mr-2">Usar como espaço:</span>
                                        {[
                                            { label: 'Espaço ( )', val: ' ' },
                                            { label: 'Hífen (-)', val: '-' },
                                            { label: 'Underline (_)', val: '_' },
                                            { label: 'Ponto (.)', val: '.' },
                                        ].map((opt) => (
                                            <button
                                                key={opt.val}
                                                onClick={() => setNameSeparator(opt.val as SeparatorType)}
                                                className={`px-3 py-1 text-xs font-bold rounded border transition-colors ${
                                                    nameSeparator === opt.val 
                                                    ? 'bg-[#ff0e00] border-[#ff0e00] text-white' 
                                                    : 'bg-zinc-800 border-zinc-600 text-zinc-300 hover:bg-zinc-700'
                                                }`}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                             </div>
                        </div>
                        
                        {/* SEO Tags Integration */}
                        {files.length > 0 && (
                            <SeoTagsGenerator files={files} t={t} />
                        )}
                        
                        <div className="mt-6">
                            {isProcessing && <ProgressDisplay progress={progress} processedCount={processedFilesCount} totalFiles={files.length} t={t} />}
                            
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={handleReset}
                                    disabled={isProcessing || files.length === 0}
                                    className="flex-1 flex items-center justify-center gap-2 bg-zinc-800 text-zinc-300 font-semibold py-3 px-4 rounded-lg hover:bg-zinc-700 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <TrashIcon className="w-5 h-5" />
                                    {t('clear')}
                                </button>

                                <button
                                    onClick={handleProcess}
                                    disabled={isProcessing || files.length === 0}
                                    className="flex-[2] flex items-center justify-center gap-2 bg-[#ff0e00] text-white font-bold py-3 px-4 rounded-lg hover:bg-[#e00c00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isProcessing ? (
                                        <>
                                            <RefreshIcon className="w-5 h-5 animate-spin" />
                                            {t('processingCropp')}
                                        </>
                                    ) : (
                                        <>
                                            <DownloadIcon className="w-5 h-5" />
                                            {t('croppDownloadZip')}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </ToolSection>
                </div>
            </div>
        </div>
    );
};

export default ElementorCropp;