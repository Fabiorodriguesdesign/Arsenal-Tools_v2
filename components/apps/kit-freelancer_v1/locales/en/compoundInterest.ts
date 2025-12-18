export default {
    title: 'Financial Growth Projection Calculator',
    step1: {
        title: 'Step 1: Setup',
    },
    step2: {
        title: 'Step 2: Projection',
    },
    projection: {
        title: 'Growth Projection',
    },
    initialAmount: {
        label: 'Initial Amount ($)',
    },
    monthlyContribution: {
        label: 'Monthly Contribution ($)',
    },
    investmentType: {
        label: 'Investment Type',
        cdb: 'Taxable (e.g., Bonds)',
        lci_lca: 'Tax-Exempt',
        savings: 'Savings Account (Tax-Exempt)',
        generic: 'Generic (no taxes)',
    },
    desc: {
        cdb: 'A regressive Income Tax (IR) is applied only to the interest (profits), from 22.5% (up to 6 months) to 15% (over 2 years).',
        lci_lca: 'These investments are tax-exempt for individuals.',
        savings: 'Savings accounts have tax-exempt returns for individuals.',
        generic: 'This calculation does not consider taxes on earnings.',
    },
    interestRate: {
        label: 'Annual Interest Rate{{type}} (%)',
    },
    gross: ' (Gross)',
    duration: {
        label: 'Investment Duration',
    },
    unit: {
        label: 'Unit',
        years: 'Years',
        months: 'Months',
    },
    simulate: 'Simulate Projection',
    results: {
        totalInvested: 'Total Invested',
        grossInterest: 'Gross Interest',
        incomeTax: 'Income Tax',
        netFinalAmount: 'Net Final Amount',
    },
    grossAmount: 'Gross Amount',
    chart: {
        grossValue: 'Gross Value',
        netValue: 'Net Value',
        totalInvested: 'Total Invested',
    }
};
