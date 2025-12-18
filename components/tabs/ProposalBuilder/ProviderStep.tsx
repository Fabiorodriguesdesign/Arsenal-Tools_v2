
import React, { useRef } from 'react';
import Input from '../../shared/Input';
import Button from '../../shared/Button';
import { useTranslation } from '../../../hooks/useTranslation';
import { ProposalData } from '../../../types/proposal';

interface ProviderStepProps {
  data: ProposalData;
  onChange: (data: Partial<ProposalData>) => void;
}

const ProviderStep: React.FC<ProviderStepProps> = ({ data, onChange }) => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File too large (max 2MB)');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({ providerLogo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    onChange({ providerLogo: undefined });
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  return (
    <div className="animate-fadeIn space-y-6">
      {/* Logo Upload Section */}
      <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-light-bg dark:bg-dark-bg rounded-lg border border-light-border dark:border-dark-border">
        <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0 border-2 border-light-border dark:border-dark-border flex items-center justify-center">
          {data.providerLogo ? (
            <img src={data.providerLogo} alt="Logo" className="max-w-full max-h-full object-contain" />
          ) : (
            <div className="text-gray-400 text-xs text-center p-2">
               Logo
            </div>
          )}
        </div>
        <div className="flex flex-col items-center sm:items-start gap-2 flex-grow">
            <h3 className="font-medium text-light-text dark:text-dark-text">{t('proposalBuilder.provider.logo')}</h3>
            <div className="flex gap-2 mt-1">
                <input 
                    type="file" 
                    accept="image/png, image/jpeg" 
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={handlePhotoUpload}
                />
                <Button size="sm" onClick={() => fileInputRef.current?.click()}>
                    {data.providerLogo ? t('resumeBuilder.personal.photo.change') : t('resumeBuilder.personal.photo.upload')}
                </Button>
                {data.providerLogo && (
                    <Button size="sm" variant="danger" onClick={handleRemovePhoto}>
                        {t('resumeBuilder.personal.photo.remove')}
                    </Button>
                )}
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="proposalBuilder.provider.name"
          name="providerName"
          value={data.providerName}
          onChange={handleChange}
          placeholder="Ex: João Silva"
        />
        <Input
          label="proposalBuilder.provider.company"
          name="providerCompany"
          value={data.providerCompany}
          onChange={handleChange}
          placeholder="Ex: JS Design Ltda"
        />
         <Input
          label="proposalBuilder.provider.document"
          name="providerDocument"
          value={data.providerDocument}
          onChange={handleChange}
          placeholder="Ex: 123.456.789-00"
        />
        <Input
          label="proposalBuilder.provider.email"
          name="providerEmail"
          type="email"
          value={data.providerEmail}
          onChange={handleChange}
          placeholder="Ex: joao@email.com"
        />
        <Input
          label="proposalBuilder.provider.phone"
          name="providerPhone"
          type="tel"
          value={data.providerPhone}
          onChange={handleChange}
          placeholder="Ex: (11) 99999-8888"
        />
        <Input
          label="proposalBuilder.provider.address"
          name="providerAddress"
          value={data.providerAddress}
          onChange={handleChange}
          placeholder="Ex: Rua das Flores, 123"
        />
      </div>
    </div>
  );
};

export default ProviderStep;
