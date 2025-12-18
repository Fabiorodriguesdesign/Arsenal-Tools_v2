export default {
    title: 'Investment Income Tax Calculator',
    variable: {
        tab: 'Variable Income',
        card: {
            title: 'Operation Data',
        },
        saleValue: {
            label: 'Total Sale Value ($)',
            placeholder: 'e.g., 25,000.00',
        },
        cost: {
            label: 'Total Acquisition Cost ($)',
            placeholder: 'e.g., Purchase price + Fees',
        },
        asset: {
            label: 'Traded Asset',
            stock: 'Stocks',
            fii: 'Real Estate Fund (REIT)',
            crypto: 'Cryptocurrencies',
            bdr: 'Capital Gains',
        },
        operation: {
            label: 'Operation Type',
            swing: 'Swing Trade (15% Rate)',
            day: 'Day Trade (20% Rate)',
        },
        disclaimer: {
            acao: 'Simplified calculation, does not consider the $20,000 monthly sales exemption for Swing Trade, nor loss compensation.',
            crypto: 'Simplified calculation, does not consider the $35,000 monthly sales exemption, nor loss compensation.',
            bdr: 'Simplified calculation, does not consider the $35,000 monthly sales exemption, nor loss compensation.',
            fii: 'Simplified calculation. Capital gains on the sale of REIT shares are taxed at 20%, with no income tax exemption range.',
        }
    },
    fixed: {
        tab: 'Fixed Income',
        card: {
            title: 'Yield Data',
        },
        profit: {
            label: 'Gross Profit ($)',
            placeholder: 'e.g., Redemption value - Invested amount - Fees',
        },
        time: {
            label: 'Total Investment Time',
            ariaLabel: 'Investment time',
        },
        disclaimer: 'The calculation considers the standard regressive table and does not include IOF (levied on redemptions in less than 30 days).',
    },
    results: {
        profitOrLoss: 'Profit/Loss',
        taxDue: 'Tax Due (IR)',
        netValue: 'Net Sale Value',
        appliedRate: 'Applied Rate',
        netProfit: 'Net Profit Value',
    }
};
