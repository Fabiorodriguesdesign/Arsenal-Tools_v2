import { InvestmentType, PeriodUnit } from '../utils/financial';

export interface CompoundInterestFormData {
    initialAmount: string;
    monthlyContribution: string;
    interestRate: string;
    period: string;
    periodUnit: PeriodUnit;
    investmentType: InvestmentType;
}