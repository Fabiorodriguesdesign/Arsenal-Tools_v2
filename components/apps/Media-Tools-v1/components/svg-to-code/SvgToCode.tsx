
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useToast } from '../../contexts/ToastContext';
import { ClipboardIcon, TrashIcon, CodeBracketIcon, UploadIcon, ChevronDownIcon } from '../icons';
import { generateReactComponent } from '../../services/svgService';
import FileUpload from '../FileUpload';
// FIX: The Checkbox component was imported from a local file that did not support the `containerClassName` property, causing a type error. The import has been updated to use the shared UI Checkbox component from `@/components/ui/Checkbox`, which correctly handles this property. This resolves the compilation errors and ensures consistent component usage.
import { Checkbox } from '../../../../ui/Checkbox';

const panelClasses = "bg-zinc-900 border border-zinc-800 p-4 sm:p-6 rounded-lg shadow-md";

const SvgToCode: React.FC = () => {
    const { t } = useLanguage();
    const { addToast } = useToast();
    const [svgInput, setSvgInput] = useState('');
    const [generatedCode, setGeneratedCode] = useState('');
    const [componentName, setComponentName] = useState('MyIcon');
    const [isTypeScript, setIsTypeScript] = useState(true);
    const [isMinified, setIsMinified] = useState(true);
    const [removeColors, setRemoveColors] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // BRIDGE: Verificar se há SVG vindo da ferramenta IMG 4 SVG
    useEffect(() => {
        const bridgedSvg = localStorage.getItem('mediaTools_bridge_svg');
        if (bridgedSvg) {
            setSvgInput(bridgedSvg);
            setComponentName('VectorizedIcon');
            addToast('SVG importado do vetorizador!', 'success');
            // Limpa para não carregar novamente ao recarregar a página
            localStorage.removeItem('mediaTools_bridge_svg');
            // Auto-gera
            setTimeout(() => generateComponentCode(bridgedSvg), 100);
        }
    }, [addToast]);

    const generateComponentCode = (svgContent: string) => {
        const result = generateReactComponent(svgContent, componentName, isTypeScript, isMinified, removeColors);
        if (result.error) {
            addToast(result.error, 'error');
        } else {
            setGeneratedCode(result.componentCode);
            addToast(t('codeGenerated'), 'success');
        }
    };

    const handleProcess = async () => {
        setIsProcessing(true);
        try {
            let svgContentToProcess = '';
            
            if (uploadedFile) {
                if (uploadedFile.type === 'image/svg+xml' || uploadedFile.name.endsWith('.svg')) {
                    svgContentToProcess = await uploadedFile.text();
                } else {
                    addToast("Apenas arquivos SVG são suportados nesta ferramenta.", 'error');
                    return;
                }
            } else if (svgInput.trim()) {
                svgContentToProcess = svgInput;
            }

            if (svgContentToProcess) {
                generateComponentCode(svgContentToProcess);
            } else {
                addToast(t('enterSvgContent'), 'warning');
            }
        } catch (error) {
            console.error(error);
            addToast("Erro ao processar SVG.", "error");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCopy = () => {
        if (!generatedCode) return;
        navigator.clipboard.writeText(generatedCode);
        addToast(t('copied'), 'success');
    };

    const handleClear = () => {
        setSvgInput('');
        setGeneratedCode('');
        setUploadedFile(null);
    };
    
    const handleFileAdd = (files: File[]) => {
        if (files.length > 0) {
            const file = files[0];
            if (file.type === 'image/svg+xml' || file.name.endsWith('.svg')) {
                setUploadedFile(file);
                setSvgInput(''); 
                addToast(t('fileLoaded'), 'success');
            } else {
                addToast("Formato não suportado. Use apenas arquivos .svg.", 'error');
            }
        }
    };

    return (
        <div className="max-w-6xl mx-auto flex flex-col gap-8 pb-20">
            <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg flex items-center gap-3">
                 <div className="bg-blue-500/20 p-2 rounded-full">
                    <CodeBracketIcon className="w-5 h-5 text-blue-400" />
                 </div>
                 <div>
                     <h4 className="text-blue-200 font-bold text-sm">Ferramenta Especializada</h4>
                     <p className="text-blue-300 text-xs">Esta ferramenta é exclusiva para código. Para converter imagens (PNG/JPG) em SVG, use a ferramenta <strong>IMG 4 SVG</strong> no menu.</p>
                 </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Section */}
                <div className="flex flex-col gap-4">
                    <div className={panelClasses}>
                        <h3 className="text-lg font-semibold text-zinc-100 mb-4">{t('uploadOrPaste')}</h3>
                        <div className="mb-4">
                             <FileUpload
                                title="Upload SVG"
                                description="Selecione arquivo .svg"
                                onFilesAdd={handleFileAdd}
                                onFileRemove={() => setUploadedFile(null)}
                                onFilesClear={() => setUploadedFile(null)}
                                acceptedFormats=".svg"
                                isMultiple={false}
                                uploadedFile={uploadedFile}
                                icon={<UploadIcon className="w-8 h-8 text-zinc-600" />}
                            />
                        </div>
                        
                        {!uploadedFile && (
                            <>
                                <div className="text-center text-zinc-500 text-sm mb-4 font-bold">- OU COLE O CÓDIGO -</div>
                                <textarea 
                                    value={svgInput} 
                                    onChange={(e) => setSvgInput(e.target.value)} 
                                    placeholder={t('pasteSvgHere')} 
                                    className="w-full h-48 p-4 bg-zinc-950 border border-zinc-700 rounded-md font-mono text-xs text-zinc-300 focus:ring-[#ff0e00] focus:border-[#ff0e00] outline-none resize-none" 
                                    spellCheck={false} 
                                />
                            </>
                        )}
                        <div className="flex justify-end mt-4">
                             <button onClick={handleClear} className="text-zinc-400 hover:text-zinc-200 text-sm flex items-center gap-2">
                                <TrashIcon className="w-4 h-4" /> {t('clear')}
                            </button>
                        </div>
                    </div>

                    <div className={panelClasses}>
                         <h3 className="text-lg font-semibold text-zinc-100 mb-4">{t('settings')}</h3>
                         <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-zinc-300 mb-1">{t('componentName')}</label>
                                <input type="text" value={componentName} onChange={(e) => setComponentName(e.target.value)} className="w-full p-2 bg-zinc-950 border border-zinc-700 rounded-md text-zinc-100 focus:ring-[#ff0e00] focus:border-[#ff0e00]" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Checkbox
                                    checked={isTypeScript}
                                    onChange={(e) => setIsTypeScript(e.target.checked)}
                                    label="TypeScript"
                                    containerClassName="bg-zinc-950 p-2 rounded border border-zinc-800 hover:border-zinc-600"
                                />
                                <Checkbox
                                    checked={isMinified}
                                    onChange={(e) => setIsMinified(e.target.checked)}
                                    label={t('minifyCode')}
                                    containerClassName="bg-zinc-950 p-2 rounded border border-zinc-800 hover:border-zinc-600"
                                />
                            </div>
                             <Checkbox
                                checked={removeColors}
                                onChange={(e) => setRemoveColors(e.target.checked)}
                                label={<div className="text-sm">
                                        <span className="text-zinc-300">{t('removeBackground')}</span>
                                        <p className="text-zinc-500 text-xs">Substitui 'fill' e 'stroke' por 'currentColor'</p>
                                    </div>}
                                containerClassName="bg-zinc-950 p-2 rounded border border-zinc-800 hover:border-zinc-600"
                            />

                            <button onClick={handleProcess} disabled={isProcessing} className="w-full bg-[#ff0e00] hover:bg-[#e00c00] text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:bg-zinc-700">
                                {isProcessing ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                                ) : (
                                    <CodeBracketIcon className="w-5 h-5" />
                                )}
                                {isProcessing ? "Processando..." : t('generateComponent')}
                            </button>
                         </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <div className={`${panelClasses} h-full flex flex-col`}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-zinc-100">{t('reactComponent')}</h3>
                            <button onClick={handleCopy} disabled={!generatedCode} className="text-zinc-400 hover:text-white disabled:opacity-50 transition-colors" title={t('copyCode')}>
                                <ClipboardIcon className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="relative flex-grow">
                             <textarea readOnly value={generatedCode} placeholder={t('codeWillAppearHere')} className="w-full h-full min-h-[400px] p-4 bg-zinc-950 border border-zinc-700 rounded-md font-mono text-xs text-green-400 focus:outline-none resize-none" spellCheck={false} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SvgToCode;