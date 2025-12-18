
import React from 'react';
import Input from '../../shared/Input';
import { useTranslation } from '../../../hooks/useTranslation';
import { ProposalData } from '../../../types/proposal';

interface ClientStepProps {
  data: ProposalData;
  onChange: (data: Partial<ProposalData>) => void;
}

const ClientStep: React.FC<ClientStepProps> = ({ data, onChange }) => {
  const { t } = useTranslation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };

  return (
    <div className="animate-fadeIn space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="proposalBuilder.client.name"
          name="clientName"
          value={data.clientName}
          onChange={handleChange}
          placeholder="Ex: Maria Souza"
        />
        <Input
          label="proposalBuilder.client.company"
          name="clientCompany"
          value={data.clientCompany}
          onChange={handleChange}
          placeholder="Ex: Empresa Cliente S.A."
        />
        <Input
          label="proposalBuilder.client.document"
          name="clientDocument"
          value={data.clientDocument}
          onChange={handleChange}
          placeholder="Ex: 00.000.000/0001-91"
        />
        <Input
          label="proposalBuilder.client.email"
          name="clientEmail"
          type="email"
          value={data.clientEmail}
          onChange={handleChange}
          placeholder="Ex: contato@cliente.com"
        />
         <div className="md:col-span-2">
            <Input
            label="proposalBuilder.client.address"
            name="clientAddress"
            value={data.clientAddress}
            onChange={handleChange}
            placeholder="Ex: Av. Paulista, 1000"
            />
         </div>
      </div>
    </div>
  );
};

export default ClientStep;
