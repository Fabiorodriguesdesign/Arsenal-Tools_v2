
import React, { useRef, useState } from 'react';
import Input from '../../shared/Input';
import Button from '../../shared/Button';
import ImageCropper from '../../shared/ImageCropper';
import { useTranslation } from '../../../hooks/useTranslation';
import { PersonalData } from '../../../types/resume';

interface PersonalStepProps {
  data: PersonalData;
  onChange: (data: PersonalData) => void;
}

const PersonalStep: React.FC<PersonalStepProps> = ({ data, onChange }) => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tempImage, setTempImage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onChange({ ...data, [name]: value });
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Basic size check before reading (prevent massive files crashing browser)
      if (file.size > 10 * 1024 * 1024) {
        alert('File too large (max 10MB). Please choose a smaller image.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setTempImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    // Reset input so same file can be selected again if needed
    e.target.value = '';
  };

  const handleCropComplete = (croppedBase64: string) => {
      onChange({ ...data, photo: croppedBase64 });
      setTempImage(null);
  };

  const handleRemovePhoto = () => {
    onChange({ ...data, photo: undefined });
  };

  return (
    <div className="animate-fadeIn space-y-6">
      {tempImage && (
          <ImageCropper 
            imageSrc={tempImage} 
            onCropComplete={handleCropComplete} 
            onCancel={() => setTempImage(null)} 
          />
      )}

      {/* Photo Upload Section */}
      <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-light-bg dark:bg-dark-bg rounded-lg border border-light-border dark:border-dark-border">
        <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0 border-2 border-light-border dark:border-dark-border">
          {data.photo ? (
            <img src={data.photo} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            </div>
          )}
        </div>
        <div className="flex flex-col items-center sm:items-start gap-2 flex-grow">
            <h3 className="font-medium text-light-text dark:text-dark-text">{t('resumeBuilder.personal.photo.label')}</h3>
            <p className="text-xs text-light-muted dark:text-dark-muted text-center sm:text-left">{t('resumeBuilder.personal.photo.helper')}</p>
            <div className="flex gap-2 mt-1">
                <input 
                    type="file" 
                    accept="image/png, image/jpeg" 
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={handlePhotoSelect}
                />
                <Button size="sm" onClick={() => fileInputRef.current?.click()}>
                    {data.photo ? t('resumeBuilder.personal.photo.change') : t('resumeBuilder.personal.photo.upload')}
                </Button>
                {data.photo && (
                    <Button size="sm" variant="danger" onClick={handleRemovePhoto}>
                        {t('resumeBuilder.personal.photo.remove')}
                    </Button>
                )}
            </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="resumeBuilder.personal.fullName"
          name="fullName"
          value={data.fullName}
          onChange={handleChange}
          placeholder="Ex: João Silva"
        />
        <Input
          label="resumeBuilder.personal.jobTitle"
          name="jobTitle"
          value={data.jobTitle}
          onChange={handleChange}
          placeholder="Ex: Senior Frontend Developer"
        />
        <Input
          label="resumeBuilder.personal.email"
          name="email"
          type="email"
          value={data.email}
          onChange={handleChange}
          placeholder="Ex: joao@email.com"
        />
        <Input
          label="resumeBuilder.personal.phone"
          name="phone"
          type="tel"
          value={data.phone}
          onChange={handleChange}
          placeholder="Ex: (11) 99999-8888"
        />
        <Input
          label="resumeBuilder.personal.location"
          name="location"
          value={data.location}
          onChange={handleChange}
          placeholder="Ex: São Paulo, SP"
        />
        <Input
          label="resumeBuilder.personal.linkedin"
          name="linkedin"
          value={data.linkedin || ''}
          onChange={handleChange}
          placeholder="Ex: linkedin.com/in/joaosilva"
        />
         <Input
          label="resumeBuilder.personal.website"
          name="website"
          value={data.website || ''}
          onChange={handleChange}
          placeholder="Ex: joaosilva.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-light-muted dark:text-dark-muted mb-1">
            {t('resumeBuilder.personal.summary')}
        </label>
        <textarea
            name="summary"
            value={data.summary}
            onChange={handleChange}
            rows={4}
            placeholder={t('resumeBuilder.personal.summaryPlaceholder')}
            className="w-full p-2 border rounded-md bg-light-input dark:bg-dark-input text-light-text dark:text-dark-text border-light-border dark:border-dark-border placeholder-light-muted/70 dark:placeholder-dark-muted/70 transition duration-200 ease-in-out focus:ring-2 focus:ring-primary focus:ring-opacity-50 focus:border-primary outline-none"
        />
      </div>
    </div>
  );
};

export default PersonalStep;