
import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import BackgroundMasterStep1 from './steps/BackgroundMasterStep1';
import BackgroundMasterStep2 from './steps/BackgroundMasterStep2';
import BackgroundMasterStep3 from './steps/BackgroundMasterStep3';
import DesktopLayout from './DesktopLayout';
import { useBackgroundProcessing } from '../../hooks/useBackgroundProcessing';

const BackgroundMaster: React.FC = () => {
    const { t } = useLanguage();
    const [mobileStep, setMobileStep] = useState(1);

    const {
        background, foregrounds, settings, currentPreviewIndex, backgroundUrl, currentForegroundUrl,
        isProcessing, progress, processedFilesCount, failedFiles, isCompleted,
        setAspectRatio, setWidth, setHeight, setOutputFormat, setIsDimensionsLinked, setPadding, setTrim,
        setRenameMode, setBaseName, setSeparator, setKeepOriginalName,
        handleBackgroundAdd, handleBackgroundClear, handleForegroundsAdd, handleForegroundRemove,
        handleForegroundsClear, handleNextPreview, handlePrevPreview, handleClearAll, handleGenerate
    } = useBackgroundProcessing();

    // Mobile Reset Wrapper
    const handleMobileReset = () => {
        handleClearAll();
        setMobileStep(1);
    };

    const isGenerateDisabled = !background || foregrounds.length === 0 || isProcessing;
    const isClearDisabled = !background && foregrounds.length === 0 && !isCompleted;

    const buttonText = isProcessing
        ? `${t('processing')} ${foregrounds.length > 1 ? `(${processedFilesCount}/${foregrounds.length})` : ''} ${progress}%`
        : (foregrounds.length === 1
            ? t('generateAndDownloadImage')
            : `${t('generateAndDownload')} (${foregrounds.length > 0 ? foregrounds.length : '0'}) ${t('images')}`);

    const renderMobileStep = () => {
        switch (mobileStep) {
            case 1: return (
                <BackgroundMasterStep1
                    background={background}
                    handleBackgroundAdd={handleBackgroundAdd}
                    handleBackgroundClear={handleBackgroundClear}
                    onNext={() => setMobileStep(2)}
                    isNextDisabled={!background}
                    t={t}
                />
            );
            case 2: return (
                <BackgroundMasterStep2
                    foregrounds={foregrounds}
                    handleForegroundsAdd={handleForegroundsAdd}
                    handleForegroundRemove={handleForegroundRemove}
                    handleForegroundsClear={handleForegroundsClear}
                    onNext={() => setMobileStep(3)}
                    onPrev={() => setMobileStep(1)}
                    isNextDisabled={foregrounds.length === 0}
                    t={t}
                />
            );
            case 3: return (
                <BackgroundMasterStep3
                    backgroundUrl={backgroundUrl}
                    currentForegroundUrl={currentForegroundUrl}
                    width={settings.width}
                    height={settings.height}
                    totalForegrounds={foregrounds.length}
                    currentIndex={currentPreviewIndex}
                    onNextPreview={handleNextPreview}
                    onPrevPreview={handlePrevPreview}
                    settings={settings}
                    setAspectRatio={setAspectRatio}
                    setWidth={setWidth}
                    setHeight={setHeight}
                    setOutputFormat={setOutputFormat}
                    setIsDimensionsLinked={setIsDimensionsLinked}
                    setPadding={setPadding}
                    setRenameMode={setRenameMode}
                    setBaseName={setBaseName}
                    setSeparator={setSeparator}
                    setTrim={setTrim}
                    setKeepOriginalName={setKeepOriginalName}
                    isProcessing={isProcessing}
                    progress={progress}
                    processedFilesCount={processedFilesCount}
                    failedFiles={failedFiles}
                    isCompleted={isCompleted}
                    handleGenerate={handleGenerate}
                    isGenerateDisabled={isGenerateDisabled}
                    onPrev={() => setMobileStep(2)}
                    handleClearAll={handleMobileReset}
                    isClearDisabled={isClearDisabled}
                    t={t}
                    buttonText={buttonText}
                />
            );
            default: return null;
        }
    };

    return (
        <>
            <div className="lg:hidden">
                {renderMobileStep()}
            </div>
            <div className="hidden lg:block">
                 <DesktopLayout
                    background={background}
                    foregrounds={foregrounds}
                    settings={settings}
                    isClearDisabled={isClearDisabled}
                    backgroundUrl={backgroundUrl}
                    currentForegroundUrl={currentForegroundUrl}
                    currentPreviewIndex={currentPreviewIndex}
                    isProcessing={isProcessing}
                    progress={progress}
                    processedFilesCount={processedFilesCount}
                    failedFiles={failedFiles}
                    isCompleted={isCompleted}
                    buttonText={buttonText}
                    isGenerateDisabled={isGenerateDisabled}
                    t={t}
                    handleBackgroundAdd={handleBackgroundAdd}
                    handleBackgroundClear={handleBackgroundClear}
                    handleForegroundsAdd={handleForegroundsAdd}
                    handleForegroundRemove={handleForegroundRemove}
                    handleForegroundsClear={handleForegroundsClear}
                    setAspectRatio={setAspectRatio}
                    setWidth={setWidth}
                    setHeight={setHeight}
                    setOutputFormat={setOutputFormat}
                    setIsDimensionsLinked={setIsDimensionsLinked}
                    setPadding={setPadding}
                    handleClearAll={handleClearAll}
                    handleNextPreview={handleNextPreview}
                    handlePrevPreview={handlePrevPreview}
                    handleGenerate={handleGenerate}
                    setRenameMode={setRenameMode}
                    setBaseName={setBaseName}
                    setSeparator={setSeparator}
                    setTrim={setTrim}
                    setKeepOriginalName={setKeepOriginalName}
                 />
            </div>
        </>
    );
};

export default BackgroundMaster;
