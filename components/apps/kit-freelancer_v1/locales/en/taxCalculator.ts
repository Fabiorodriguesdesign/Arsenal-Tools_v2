export default {
    title: 'Tax and Profit Calculator',
    card: {
        title: 'Data for Analysis',
    },
    monthlyRevenue: {
        label: '1. Estimated Gross Monthly Revenue ($)',
        placeholder: 'e.g., 7000',
    },
    taxRegime: {
        label: '2. Tax Regime',
        mei: 'Fixed Monthly Tax',
        simples3: 'Simple Tax - Category III',
        simples5: 'Simple Tax - Category V',
    },
    meiDas: {
        label: 'Fixed Tax Amount ($)',
    },
    serviceValue: {
        label: '3. Value of This Service ($)',
        placeholder: 'e.g., 2000',
    },
    calculate: {
        button: 'Calculate Taxes',
    },
    results: {
        title: 'Analysis Results',
    },
    effectiveRate: 'Effective Rate',
    meiRate: {
        note: '(Based on fixed tax over revenue)',
    },
    monthlyResults: {
        title: 'Monthly Results',
    },
    monthlyTax: 'Estimated Monthly Tax',
    monthlyNet: 'Estimated Net Monthly Income',
    serviceResults: {
        title: 'Service Results',
    },
    serviceTax: 'Tax on Service',
    serviceNet: 'Net Value of Service',
    warning: {
        meiLimit: 'The monthly revenue of {{revenue}} exceeds the recommended limit for the simplified regime ($6,750/month). Consider upgrading your business category.',
        simplesLimit: 'The annual revenue exceeds the limit for the Simple Tax regime ($4.8 million).',
        factorR: 'Category V is subject to the "R Factor". If payroll expenses are ≥ 28% of revenue, taxation might be based on Category III, which is more advantageous. This calculator does not consider the R Factor.',
    },
    fillData: 'Fill in the data and click "Calculate Taxes" to see the analysis.',
    disclaimer: 'This is a simplified simulation. The values are estimates and do not replace professional accounting advice.',
};
