
import common from './common';
import landing from './landing';
import priceCalculator from './priceCalculator';
import taxCalculator from './taxCalculator';
import investmentTax from './investmentTax';
import compoundInterest from './compoundInterest';
import currencyConverter from './currencyConverter';
import smartGoals from './smartGoals';
import socialEngagement from './socialEngagement';
import whatsapp from './whatsapp';
import qrCodeGenerator from './qrCodeGenerator';
import unitConverter from './unitConverter';
import resumeBuilder from './resumeBuilder';
import proposalBuilder from './proposalBuilder';
import receiptGenerator from './receiptGenerator';
import settings from './settings';

export const en = {
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
