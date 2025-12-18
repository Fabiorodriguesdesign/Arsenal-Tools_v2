
import { AspectRatio, OutputFormat } from '../../types';

type TFunction = (key: string, replacements?: { [key: string]: string | number }) => string;
type RenameMode = 'base' | 'smart';
type SeparatorType = '-' | '_' | ' ' | '.';

export interface Step1Props {
    background: File | null;
    handleBackgroundAdd: (files: File[]) => void;
    handleBackgroundClear: () => void;
    onNext: () => void;
    isNextDisabled: boolean;
    t: TFunction;
}

export interface Step2Props {
    foregrounds: File[];
    handleForegroundsAdd: (files: File[]) => void;
    handleForegroundRemove: (index: number) => void;
    handleForegroundsClear: () => void;
    onNext: () => void;
    onPrev: () => void;
    isNextDisabled: boolean;
    t: TFunction;
}

export interface Step3Props {
    backgroundUrl: string | null;
    currentForegroundUrl: string | null;
    width: number;
    height: number;
    totalForegrounds: number;
    currentIndex: number;
    onNextPreview: () => void;
    onPrevPreview: () => void;
    settings: any;
    setAspectRatio: (ratio: AspectRatio) => void;
    setWidth: (w: number) => void;
    setHeight: (h: number) => void;
    setOutputFormat: (format: OutputFormat) => void;
    setIsDimensionsLinked: (isLinked: boolean) => void;
    setPadding: (p: number) => void;
    setRenameMode: (mode: RenameMode) => void;
    setBaseName: (name: string) => void;
    setSeparator: (sep: SeparatorType) => void;
    setTrim: (trim: boolean) => void;
    setKeepOriginalName: (val: boolean) => void;
    isProcessing: boolean;
    progress: number;
    processedFilesCount: number;
    failedFiles: string[];
    isCompleted: boolean;
    handleGenerate: () => void;
    isGenerateDisabled: boolean;
    onPrev: () => void;
    handleClearAll: () => void;
    isClearDisabled: boolean;
    t: TFunction;
    buttonText: string;
}

export interface DesktopLayoutProps {
    background: File | null;
    foregrounds: File[];
    settings: any;
    isClearDisabled: boolean;
    backgroundUrl: string | null;
    currentForegroundUrl: string | null;
    currentPreviewIndex: number;
    isProcessing: boolean;
    progress: number;
    processedFilesCount: number;
    failedFiles: string[];
    isCompleted: boolean;
    buttonText: string;
    isGenerateDisabled: boolean;
    t: TFunction;
    handleBackgroundAdd: (files: File[]) => void;
    handleBackgroundClear: () => void;
    handleForegroundsAdd: (files: File[]) => void;
    handleForegroundRemove: (index: number) => void;
    handleForegroundsClear: () => void;
    setAspectRatio: (ratio: AspectRatio) => void;
    setWidth: (w: number) => void;
    setHeight: (h: number) => void;
    setOutputFormat: (format: OutputFormat) => void;
    setIsDimensionsLinked: (isLinked: boolean) => void;
    setPadding: (p: number) => void;
    setRenameMode: (mode: RenameMode) => void;
    setBaseName: (name: string) => void;
    setSeparator: (sep: SeparatorType) => void;
    setTrim: (trim: boolean) => void;
    setKeepOriginalName: (val: boolean) => void;
    handleClearAll: () => void;
    handleNextPreview: () => void;
    handlePrevPreview: () => void;
    handleGenerate: () => void;
}
