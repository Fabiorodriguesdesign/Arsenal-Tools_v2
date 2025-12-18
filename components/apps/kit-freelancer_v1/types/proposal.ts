
export interface ProposalItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export type ProposalLanguage = 'pt' | 'en' | 'es';

export interface ProposalData {
  // My Data (Provider)
  providerName: string;
  providerEmail: string;
  providerPhone: string;
  providerCompany: string;
  providerDocument: string; // CNPJ/CPF
  providerAddress: string;
  providerLogo?: string;

  // Client Data
  clientName: string;
  clientCompany: string;
  clientEmail: string;
  clientDocument: string;
  clientAddress: string;
  
  // Project Details
  projectTitle: string;
  introduction: string;
  
  // Items
  items: ProposalItem[];
  
  // Settings
  currency: string;
  issueDate: string;
  validUntil: string;
  terms: string;
  
  // Customization
  templateId: 'modern' | 'classic' | 'clean';
  lang: ProposalLanguage;
}
