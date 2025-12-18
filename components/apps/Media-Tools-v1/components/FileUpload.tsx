
import React, { useState, useCallback, useRef, memo } from 'react';
import { UploadIcon, CloseIcon } from './icons';
import { useLanguage } from '../contexts/LanguageContext';

export interface FileUploadProps {
  onFilesAdd: (files: File[]) => void;
  onFileRemove: (index: number) => void;
  onFilesClear: () => void;
  title: string;
  description: string;
  acceptedFormats: string;
  isMultiple: boolean;
  uploadedFile: File | File[] | null;
  icon: React.ReactNode;
}

interface FileListItemProps {
  file: File;
  index: number;
  onRemove: (e: React.MouseEvent, index: number) => void;
  t: (key: string, replacements?: { [key: string]: string | number }) => string;
}

const FileListItem: React.FC<FileListItemProps> = memo(({ file, index, onRemove, t }) => {
  return (
    <li className="flex items-center justify-between bg-light-bg dark:bg-zinc-900/60 p-2 rounded-md text-sm border border-light-border dark:border-zinc-800/50">
      <span className="truncate text-light-muted dark:text-zinc-200 pr-2 font-mono text-xs">{file.name}</span>
      <button 
          onClick={(e) => onRemove(e, index)} 
          className="flex-shrink-0 text-primary hover:text-red-400 p-1 rounded-full hover:bg-red-500/10 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label={t('removeFile', { fileName: file.name })}
      >
          <CloseIcon className="w-4 h-4" />
      </button>
    </li>
  );
});


const FileUpload: React.FC<FileUploadProps> = ({ onFilesAdd, onFileRemove, onFilesClear, title, description, acceptedFormats, isMultiple, uploadedFile, icon }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files && files.length > 0) {
      onFilesAdd(isMultiple ? files : [files[0]]);
    }
  }, [isMultiple, onFilesAdd]);

  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLDivElement>) => {
    // Só processa se não estiver em um campo de texto
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

    const files = Array.from(e.clipboardData.files);
    if (files && files.length > 0) {
        e.preventDefault();
        onFilesAdd(isMultiple ? files : [files[0]]);
    }
  }, [isMultiple, onFilesAdd]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files && files.length > 0) {
      onFilesAdd(isMultiple ? files : [files[0]]);
    }
    if (e.target) {
      e.target.value = '';
    }
  };

  const handleRemoveClick = useCallback((e: React.MouseEvent, index?: number) => {
    e.stopPropagation();
    if (isMultiple && index !== undefined) {
        onFileRemove(index);
    } else {
        onFilesClear();
    }
  }, [isMultiple, onFileRemove, onFilesClear]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fileInputRef.current?.click();
    }
  };

  const hasFiles = uploadedFile && (Array.isArray(uploadedFile) ? uploadedFile.length > 0 : true);
  const fileCount = Array.isArray(uploadedFile) ? uploadedFile.length : (uploadedFile ? 1 : 0);

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-light-text dark:text-zinc-300 mb-2">{title}</label>
      <div
        className={`relative flex justify-center items-center w-full p-6 border-2 border-dashed rounded-lg cursor-pointer transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue dark:focus-visible:ring-offset-zinc-900
          ${isDragging ? 'border-accent-blue dark:border-accent-purple bg-accent-blue/10 dark:bg-accent-purple/10' : 'border-light-border dark:border-zinc-700 bg-light-bg dark:bg-zinc-950/50 hover:border-neutral-400 dark:hover:border-zinc-600'}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onPaste={handlePaste}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label={`${title}. ${description}. ${t('clickToSelect')}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={acceptedFormats}
          multiple={isMultiple}
          onChange={handleFileChange}
        />
        <div className="text-center" aria-hidden="true">
          {icon}
          <p className="mt-2 text-sm text-light-muted dark:text-zinc-400">
            <span className="font-semibold text-accent-blue dark:text-accent-purple">{t('clickToSelect')}</span> {t('orDragAndDropAndPaste')}
          </p>
          <p className="text-xs text-neutral-400 dark:text-zinc-500">{description}</p>
        </div>
      </div>
      
      {hasFiles && (
        <div className="mt-4 animate-fade-in">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-semibold text-light-text dark:text-zinc-200">
                {t('selectedFiles')} ({fileCount})
            </h4>
          </div>
          <ul 
            className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar"
            aria-live="polite" // Notifica o leitor de tela sobre mudanças na lista
          >
            {(Array.isArray(uploadedFile) ? uploadedFile : [uploadedFile]).map((file, index) => (
              file && <FileListItem key={`${file.name}-${index}`} file={file} index={index} onRemove={handleRemoveClick} t={t} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileUpload;