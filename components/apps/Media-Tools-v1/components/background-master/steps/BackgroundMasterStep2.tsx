import React from 'react';
import MobileStepContainer from '../../common/MobileStepContainer';
import FileUpload from '../../FileUpload';
import { UploadIcon } from '../../icons';
import { Step2Props } from '../types';

const BackgroundMasterStep2: React.FC<Step2Props> = ({ foregrounds, handleForegroundsAdd, handleForegroundRemove, onNext, onPrev, isNextDisabled, t, handleForegroundsClear }) => (
    <MobileStepContainer
        stepNumber={2}
        totalSteps={3}
        title={t('selectPNGs')}
        onNext={onNext}
        onPrev={onPrev}
        isNextDisabled={isNextDisabled}
        t={t}
    >
        <FileUpload
            title={t('selectPNGsUploadTitle')}
            description={t('transparentPngsOnly')}
            onFilesAdd={handleForegroundsAdd}
            onFileRemove={handleForegroundRemove}
            onFilesClear={handleForegroundsClear}
            acceptedFormats="image/png"
            isMultiple={true}
            uploadedFile={foregrounds}
            icon={<UploadIcon className="w-10 h-10 text-zinc-600" />}
        />
    </MobileStepContainer>
);

export default BackgroundMasterStep2;
