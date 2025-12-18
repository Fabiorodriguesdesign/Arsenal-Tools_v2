
import common from './common';

// Nota: Para os sub-apps (Price Calculator, etc), ainda usaremos o inglês como fallback 
// temporário até que suas traduções específicas sejam criadas, para evitar crash.
// O 'common' é o mais importante para a Landing Page.

import landing from '../en/landing'; // Fallback
import priceCalculator from '../en/priceCalculator'; // Fallback
import taxCalculator from '../en/taxCalculator'; // Fallback
import investmentTax from '../en/investmentTax'; // Fallback
import compoundInterest from '../en/compoundInterest'; // Fallback
import currencyConverter from '../en/currencyConverter'; // Fallback
import smartGoals from '../en/smartGoals'; // Fallback
import socialEngagement from '../en/socialEngagement'; // Fallback
import whatsapp from '../en/whatsapp'; // Fallback
import qrCodeGenerator from '../en/qrCodeGenerator'; // Fallback
import unitConverter from '../en/unitConverter'; // Fallback
import resumeBuilder from '../en/resumeBuilder'; // Fallback
import proposalBuilder from '../en/proposalBuilder'; // Fallback
import receiptGenerator from '../en/receiptGenerator'; // Fallback
import settings from '../en/settings'; // Fallback

export const es = {
    ...common,
    landing,
    // Remapped keys to match existing component code
    tax: taxCalculator,
    unit: unitConverter,
    currency: currencyConverter,
    qrCode: qrCodeGenerator,

    // Matching keys
    priceCalculator,
    investmentTax,
    compoundInterest,
    smartGoals,
    socialEngagement,
    whatsapp,
    resumeBuilder,
    proposalBuilder,
    receiptGenerator,
    settings
};
