export default {
    title: 'Calculadora de IR sobre Investimentos',
    variable: {
        tab: 'Renda Variável',
        card: {
            title: 'Dados da Operação',
        },
        saleValue: {
            label: 'Valor Total de Venda (R$)',
            placeholder: 'Ex: 25.000,00',
        },
        cost: {
            label: 'Custo Total de Aquisição (R$)',
            placeholder: 'Ex: Preço de compra + Taxas + Corretagem',
        },
        asset: {
            label: 'Ativo Negociado',
            stock: 'Ações',
            fii: 'Fundo Imobiliário (FII)',
            crypto: 'Criptomoedas',
            bdr: 'BDRs / Ganhos de Capital',
        },
        operation: {
            label: 'Tipo de Operação',
            swing: 'Swing Trade (Alíquota 15%)',
            day: 'Day Trade (Alíquota 20%)',
        },
        disclaimer: {
            acao: 'O cálculo é simplificado e não considera a isenção de R$ 20.000 em vendas mensais para Swing Trade, nem compensação de prejuízos.',
            crypto: 'O cálculo é simplificado e não considera a isenção de R$ 35.000 em vendas mensais, nem compensação de prejuízos.',
            bdr: 'O cálculo é simplificado e não considera a isenção de R$ 35.000 em vendas mensais, nem compensação de prejuízos.',
            fii: 'O cálculo é simplificado. Ganhos de capital na venda de cotas de FIIs são tributados em 20%, sem faixa de isenção de imposto de renda.',
        }
    },
    fixed: {
        tab: 'Renda Fixa',
        card: {
            title: 'Dados do Rendimento',
        },
        profit: {
            label: 'Lucro Bruto (R$)',
            placeholder: 'Ex: Valor resgatado - Valor investido - Taxas',
        },
        time: {
            label: 'Tempo Total de Investimento',
            ariaLabel: 'Tempo de investimento',
        },
        disclaimer: 'O cálculo considera a tabela regressiva padrão e não inclui IOF (incidente em resgates com menos de 30 dias).',
    },
    results: {
        profitOrLoss: 'Lucro/Prejuízo',
        taxDue: 'Imposto Devido (IR)',
        netValue: 'Valor Líquido da Venda',
        appliedRate: 'Alíquota Aplicada',
        netProfit: 'Valor Líquido do Lucro',
    }
};
