
import { ResultData } from '../types/servicePrice';

export type PeriodUnit = 'years' | 'months';
export type InvestmentType = 'generic' | 'cdb' | 'lci_lca' | 'savings';

export interface CompoundInterestResult {
    chartData: Array<{
        month: number;
        grossValue: number;
        totalInvested: number;
        netValue: number;
    }>;
    totalInvested: number;
    totalInterest: number;
    finalAmount: number;
    incomeTax: number;
    finalAmountNet: number;
}

export const calculateCompoundInterest = (
    initialAmountStr: string,
    monthlyContributionStr: string,
    interestRateStr: string,
    periodStr: string,
    periodUnit: PeriodUnit,
    investmentType: InvestmentType
): CompoundInterestResult => {
    const principal = parseFloat(initialAmountStr) || 0;
    const monthly = parseFloat(monthlyContributionStr) || 0;
    const annualRate = (parseFloat(interestRateStr) || 0) / 100;
    const time = parseInt(periodStr, 10) || 0;
    const totalMonths = periodUnit === 'years' ? time * 12 : time;
    
    const monthlyRate = Math.pow(1 + annualRate, 1 / 12) - 1;
    
    let currentAmount = principal;
    const data = [{ 
        month: 0, 
        grossValue: principal, 
        totalInvested: principal,
        netValue: principal
    }];

    for (let i = 1; i <= totalMonths; i++) {
        currentAmount = (currentAmount + monthly) * (1 + monthlyRate);
        const totalInvestedThisMonth = principal + (monthly * i);
        data.push({ 
            month: i, 
            grossValue: parseFloat(currentAmount.toFixed(2)),
            totalInvested: totalInvestedThisMonth,
            netValue: 0 // Will be calculated later
        });
    }

    const grossFinalAmount = currentAmount;
    const invested = principal + (monthly * totalMonths);
    const grossInterest = grossFinalAmount - invested;
    
    // Helper to calculate IR rate based on months
    const getIrRate = (months: number): number => {
        if (months <= 6) return 0.225;
        if (months <= 12) return 0.20;
        if (months <= 24) return 0.175;
        return 0.15;
    };

    let tax = 0;
    if (investmentType === 'cdb' && grossInterest > 0) {
        tax = grossInterest * getIrRate(totalMonths);
    }

    const netFinalAmount = grossFinalAmount - tax;
    
    // Calculate net value for each data point for the chart
    data.forEach(point => {
        const pointGrossInterest = point.grossValue - point.totalInvested;
        let pointTax = 0;
        if (investmentType === 'cdb' && pointGrossInterest > 0) {
            pointTax = pointGrossInterest * getIrRate(point.month);
        }
        point.netValue = parseFloat((point.grossValue - pointTax).toFixed(2));
    });

    return {
        chartData: data,
        totalInvested: invested,
        totalInterest: grossInterest,
        finalAmount: grossFinalAmount,
        incomeTax: tax,
        finalAmountNet: netFinalAmount,
    };
};

// --- Service Price Calculation ---

export interface ServicePriceInput {
    monthlySalary: number;
    fixedCosts: number;
    hoursPerDay: number;
    workDaysPerMonth: number;
    projectTime: number;
    projectTimeUnit: 'hours' | 'days';
    profitMargin: number;
    taxRegime: 'mei' | 'simples';
    meiDasValue: number;
    effectiveTaxRate: number;
}

export const calculateServicePrice = (input: ServicePriceInput): ResultData => {
    const {
        monthlySalary,
        fixedCosts,
        hoursPerDay,
        workDaysPerMonth,
        projectTime,
        projectTimeUnit,
        profitMargin,
        taxRegime,
        meiDasValue,
        effectiveTaxRate
    } = input;

    const totalMonthlyHours = workDaysPerMonth * hoursPerDay;
    const isMei = taxRegime === 'mei';
    
    // Total monthly cost basis for hourly rate calculation
    const totalMonthlyCosts = monthlySalary + fixedCosts + (isMei ? meiDasValue : 0);
    const baseHourlyRate = totalMonthlyHours > 0 ? totalMonthlyCosts / totalMonthlyHours : 0;

    const totalProjectHours = projectTimeUnit === 'days' ? projectTime * hoursPerDay : projectTime;
    const baseProjectCost = baseHourlyRate * totalProjectHours;

    // Price with Profit (before tax markup)
    const priceWithProfit = baseProjectCost * (1 + profitMargin / 100);

    let finalPrice = priceWithProfit;
    let taxAmount = 0;

    if (!isMei) {
        // Gross Up Calculation: Final Price = Net / (1 - TaxRate)
        // This ensures that after subtracting taxes from Final Price, we get exactly priceWithProfit
        const taxRateDecimal = effectiveTaxRate / 100;
        if (taxRateDecimal > 0 && taxRateDecimal < 1) {
            finalPrice = priceWithProfit / (1 - taxRateDecimal);
            taxAmount = finalPrice * taxRateDecimal;
        }
    }

    const profitValue = finalPrice - baseProjectCost - taxAmount;
    const netProjectRevenue = finalPrice - taxAmount;

    return {
        suggestedProjectPrice: finalPrice,
        baseProjectCost: baseProjectCost,
        estimatedTax: taxAmount,
        totalProfit: profitValue,
        baseHourlyRate: baseHourlyRate,
        netProjectRevenue: netProjectRevenue,
    };
};

// Helper Functions for Currency
export const parseBRL = (value: string): string => {
  if (typeof value !== 'string' || !value) return '';
  return value.replace(/\./g, '').replace(',', '.');
};

export const formatBRL = (value: string): string => {
  const num = parseFloat(parseBRL(value));
  if (isNaN(num)) return '';
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
};
