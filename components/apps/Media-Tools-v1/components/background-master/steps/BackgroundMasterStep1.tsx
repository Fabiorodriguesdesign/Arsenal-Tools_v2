import React from 'react';
import MobileStepContainer from '../../common/MobileStepContainer';
import FileUpload from '../../FileUpload';
import { ImageIcon } from '../../icons';
import { Step1Props } from '../types';

const BackgroundMasterStep1: React.FC<Step1Props> = ({ background, handleBackgroundAdd, handleBackgroundClear, onNext, isNextDisabled, t }) => (
    <MobileStepContainer
        stepNumber={1}
        totalSteps={3}
        title={t('chooseBackgroundImage')}
        onNext={onNext}
        isNextDisabled={isNextDisabled}
        t={t}
    >
        <FileUpload
            title={t('backgroundUploadTitle')}
            description={t('jpgPngOnly')}
            onFilesAdd={handleBackgroundAdd}
            onFilesClear={handleBackgroundClear}
            onFileRemove={() => {}}
            acceptedFormats="image/jpeg, image/png"
            isMultiple={false}
            uploadedFile={background}
            icon={<ImageIcon className="w-10 h-10 text-zinc-600" />}
        />
    </MobileStepContainer>
);

export default BackgroundMasterStep1;
