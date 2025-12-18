import React, { useMemo } from 'react';
import Input from '../../shared/Input';
import Button from '../../shared/Button';
import { useTranslation } from '../../../hooks/useTranslation';
import { ProposalData, ProposalItem } from '../../../types/proposal';
import { CloseIconSmall } from '../../shared/Icons';

interface ProjectStepProps {
  data: ProposalData;
  onChange: (data: Partial<ProposalData>) => void;
  onItemsChange: (items: ProposalItem[]) => void;
}

const ProjectStep: React.FC<ProjectStepProps> = ({ data, onChange, onItemsChange }) => {
  const { t } = useTranslation();
  const { items, currency } = data;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };
  
  // --- Items Logic (merged from ItemsStep) ---
  const addItem = () => {
    const newItem: ProposalItem = {
      id: Date.now().toString(),
      name: '',
      description: '',
      quantity: 1,
      unitPrice: 0,
    };
    onItemsChange([...items, newItem]);
  };

  const removeItem = (id: string) => {
    onItemsChange(items.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, field: keyof ProposalItem, value: any) => {
    onItemsChange(
      items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const formatCurrency = (val: number) => {
      try {
          return new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(val);
      } catch {
          return `${currency} ${val.toFixed(2)}`;
      }
  }

  const total = useMemo(() => {
      return items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
  }, [items]);

  return (
    <div className="animate-fadeIn space-y-6">
      {/* --- Project Details --- */}
      <Input
        label="proposalBuilder.project.title"
        name="projectTitle"
        value={data.projectTitle}
        onChange={handleChange}
        placeholder="Ex: Desenvolvimento de Website Institucional"
      />
      
      <div>
        <label className="block text-sm font-medium text-light-muted dark:text-dark-muted mb-1">
            {t('proposalBuilder.project.introduction')}
        </label>
        <textarea
            name="introduction"
            value={data.introduction}
            onChange={handleChange}
            rows={4}
            className="w-full p-2 border rounded-md bg-light-input dark:bg-dark-input text-light-text dark:text-dark-text border-light-border dark:border-dark-border placeholder-light-muted/70 dark:placeholder-dark-muted/70 transition duration-200 ease-in-out focus:ring-2 focus:ring-primary focus:ring-opacity-50 focus:border-primary outline-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
            label="proposalBuilder.project.issueDate"
            name="issueDate"
            type="date"
            value={data.issueDate}
            onChange={handleChange}
        />
        <Input
            label="proposalBuilder.project.validUntil"
            name="validUntil"
            type="date"
            value={data.validUntil}
            onChange={handleChange}
        />
         <div>
            <label className="block text-sm font-medium text-light-muted dark:text-dark-muted mb-1">{t('proposalBuilder.project.currency')}</label>
            <select 
                name="currency"
                value={data.currency} 
                onChange={handleChange} 
                className="w-full p-2 border rounded-md bg-light-input dark:bg-dark-input text-light-text dark:text-dark-text border-light-border dark:border-dark-border transition duration-200 ease-in-out focus:ring-2 focus:ring-primary focus:ring-opacity-50 focus:border-primary outline-none"
            >
                <option value="BRL">BRL (R$)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
            </select>
         </div>
      </div>
      
      <div className="border-t border-light-border dark:border-dark-border pt-6 mt-6"></div>

      {/* --- Items Section --- */}
       {items.length === 0 ? (
         <div className="text-center py-10 bg-light-bg dark:bg-dark-bg rounded-lg border border-dashed border-light-border dark:border-dark-border">
            <p className="text-light-muted dark:text-dark-muted mb-4">{t('proposalBuilder.items.empty')}</p>
            <Button onClick={addItem}>{t('proposalBuilder.items.addItem')}</Button>
         </div>
      ) : (
          items.map((item, index) => (
              <div key={item.id} className="p-4 bg-light-bg dark:bg-dark-bg rounded-lg border border-light-border dark:border-dark-border relative group">
                   <div className="absolute top-4 right-4">
                    <button 
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-light-muted hover:text-danger transition-colors rounded focus:outline-none focus:ring-2 focus:ring-danger"
                        aria-label={t('common.removeAriaLabel', { item: item.name || 'Item' })}
                    >
                        <CloseIconSmall />
                    </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        <div className="md:col-span-6">
                             <Input
                                label="proposalBuilder.items.name"
                                value={item.name}
                                onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                                placeholder="Ex: Criação de Layout"
                            />
                        </div>
                        <div className="md:col-span-2">
                             <Input
                                label="proposalBuilder.items.quantity"
                                type="number"
                                value={item.quantity}
                                onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                            />
                        </div>
                         <div className="md:col-span-4">
                             <Input
                                label="proposalBuilder.items.unitPrice"
                                type="number"
                                value={item.unitPrice}
                                onChange={(e) => updateItem(item.id, 'unitPrice', Number(e.target.value))}
                            />
                        </div>
                        <div className="md:col-span-12">
                            <Input
                                label="proposalBuilder.items.description"
                                value={item.description}
                                onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                                placeholder="Ex: Design responsivo com 3 revisões inclusas."
                            />
                        </div>
                        <div className="md:col-span-12 text-right text-sm font-semibold text-light-text dark:text-dark-text">
                            Subtotal: {formatCurrency(item.quantity * item.unitPrice)}
                        </div>
                    </div>
              </div>
          ))
      )}
      
      <div className="flex flex-col items-center gap-4 mt-6 pt-4 border-t border-light-border dark:border-dark-border">
           {items.length > 0 && <Button onClick={addItem} variant="secondary" size="sm">{t('proposalBuilder.items.addItem')}</Button>}
           <div className="text-xl font-bold text-light-text dark:text-dark-text">
                {t('proposalBuilder.items.total')} <span className="text-secondary">{formatCurrency(total)}</span>
           </div>
      </div>
    </div>
  );
};

export default ProjectStep;