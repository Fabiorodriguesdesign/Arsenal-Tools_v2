
import React from 'react';
import { Tab, TabCategory } from './types';
import { Icon } from '../../../components/icons';

// --- Lazy Load Tab Components ---
const ServicePriceCalculator = React.lazy(() => import('./components/tabs/ServicePriceCalculator')); 
const TaxCalculator = React.lazy(() => import('./components/tabs/TaxCalculator'));
const WhatsappLinkGenerator = React.lazy(() => import('./components/tabs/WhatsappLinkGenerator'));
const CompoundInterest = React.lazy(() => import('./components/tabs/CompoundInterest'));
const UnitConverter = React.lazy(() => import('./components/tabs/UnitConverter'));
const QrCodeGenerator = React.lazy(() => import('./components/tabs/QrCodeGenerator'));
const CurrencyConverter = React.lazy(() => import('./components/tabs/CurrencyConverter'));
const InvestmentTaxCalculator = React.lazy(() => import('./components/tabs/InvestmentTaxCalculator'));
const SmartGoals = React.lazy(() => import('./components/tabs/SmartGoals'));
const SocialEngagement = React.lazy(() => import('./components/tabs/SocialEngagement')); 
const ResumeBuilder = React.lazy(() => import('./components/tabs/ResumeBuilder/ResumeBuilder'));
const ProposalBuilder = React.lazy(() => import('./components/tabs/ProposalBuilder/ProposalBuilder'));
const ReceiptGenerator = React.lazy(() => import('./components/tabs/ReceiptGenerator'));
// Settings is moved to utility/footer area usually, but keeping here if needed as a tool
const Settings = React.lazy(() => import('./components/tabs/Settings'));

// Categorias Pai Definidas
export const CATEGORIZED_TABS: TabCategory[] = [
    {
        nameKey: "category.finance", // FINANCEIRO E NEGÓCIOS
        items: [
            { id: 'price-calculator', nameKey: 'tab.priceCalculator', icon: <Icon name="currency-dollar" className="w-full h-full" />, component: ServicePriceCalculator },
            { id: 'currency-converter', nameKey: 'tab.currencyConverter', icon: <Icon name="coins" className="w-full h-full" />, component: CurrencyConverter },
            { id: 'proposal-builder', nameKey: 'tab.proposalBuilder', icon: <Icon name="proposal-builder" className="w-full h-full" />, component: ProposalBuilder },
            { id: 'receipt-generator', nameKey: 'tab.receiptGenerator', icon: <Icon name="receipt-generator" className="w-full h-full" />, component: ReceiptGenerator },
            { id: 'investment-tax', nameKey: 'tab.investmentTax', icon: <Icon name="investment-tax" className="w-full h-full" />, component: InvestmentTaxCalculator },
            { id: 'compound-interest', nameKey: 'tab.compoundInterest', icon: <Icon name="compound-interest" className="w-full h-full" />, component: CompoundInterest },
            { id: 'tax-calculator', nameKey: 'tab.taxCalculator', icon: <Icon name="tax-calculator" className="w-full h-full" />, component: TaxCalculator },
        ]
    },
    {
        nameKey: "category.marketing", // MARKETING E CRESCIMENTO
        items: [
            { id: 'social-engagement', nameKey: 'tab.socialEngagement', icon: <Icon name="message-circle-heart" className="w-full h-full" />, component: SocialEngagement },
            { id: 'qr-code-generator', nameKey: 'tab.qrCodeGenerator', icon: <Icon name="qr-code" className="w-full h-full" />, component: QrCodeGenerator },
            { id: 'whatsapp-generator', nameKey: 'tab.whatsappGenerator', icon: <Icon name="whatsapp-logo-detailed" className="w-full h-full" />, component: WhatsappLinkGenerator },
            { id: 'smart-goals', nameKey: 'tab.smartGoals', icon: <Icon name="goal" className="w-full h-full" />, component: SmartGoals },
        ]
    },
    {
        nameKey: "category.utilities", // UTILITÁRIOS TÉCNICOS
        items: [
            { id: 'unit-converter', nameKey: 'tab.unitConverter', icon: <Icon name="unit-converter" className="w-full h-full" />, component: UnitConverter },
            { id: 'resume-builder', nameKey: 'tab.resumeBuilder', icon: <Icon name="file-user" className="w-full h-full" />, component: ResumeBuilder },
            { id: 'settings', nameKey: 'tab.settings', icon: <Icon name="settings" className="w-full h-full" />, component: Settings },
        ]
    },
];

// Flattened list for easier lookup
export const TABS: Tab[] = CATEGORIZED_TABS.flatMap(category => category.items);
